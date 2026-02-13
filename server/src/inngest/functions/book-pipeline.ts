import { inngest } from '../client.js';
import {
	getPipeline,
	getImages,
	updatePipeline,
	broadcast,
	debugLog,
} from '../../services/storage.js';
import {
	characterizePhotos,
	generateSuggestions,
	generateStory,
} from '../../services/openai.js';
import { generateImage } from '../../services/replicate.js';
import { getStylePreviewBuffer } from '../../services/db.js';
import { PAGE_COUNT, STORY_STYLES } from '@childrenbook/shared/types/pipeline';

export const bookPipeline = inngest.createFunction(
	{ id: 'book-pipeline' },
	{ event: 'pipeline/started' },
	async ({ event, step }) => {
		const { runId } = event.data;

		debugLog(runId, 'Inngest book-pipeline function started');

		// Step 1: Characterize uploaded photos
		debugLog(runId, 'Step 1: Starting characterization...');
		updatePipeline(runId, { status: 'characterizing' });

		const characters = await step.run('characterize', async () => {
			const imageBuffers = getImages(runId);
			if (!imageBuffers || imageBuffers.length === 0) {
				throw new Error('No images found for this pipeline run');
			}

			debugLog(runId, `Calling OpenAI characterizePhotos with ${imageBuffers.length} image(s)...`);
			const result = await characterizePhotos(imageBuffers);
			debugLog(runId, `Characterization complete: ${result.length} character(s) detected`);
			return result;
		});

		// Update storage AFTER step completes (runs on every invocation)
		debugLog(runId, `Characters: ${characters.map((c) => c.name).join(', ')}`);
		updatePipeline(runId, { characters, status: 'waiting-for-names' });

		// Step 2: Wait for user to confirm/edit character names
		debugLog(runId, 'Waiting for user to confirm names...');
		const namesEvent = await step.waitForEvent(
			'wait-for-names-confirmed',
			{
				event: 'pipeline/names-confirmed',
				timeout: '30m',
				match: 'data.runId',
			},
		);

		if (!namesEvent) {
			updatePipeline(runId, {
				status: 'error',
				error: 'Name confirmation timed out after 30 minutes',
			});
			return { error: 'timeout' };
		}

		// Apply the confirmed names to the characters
		debugLog(runId, `Names confirmed: ${namesEvent.data.names.join(', ')}`);
		const confirmedNames = namesEvent.data.names;
		const namedCharacters = characters.map((c, i) => ({
			...c,
			name: confirmedNames[i] ?? c.name,
		}));
		updatePipeline(runId, { characters: namedCharacters });

		// Step 3: Generate story suggestions
		debugLog(runId, 'Step 3: Generating story suggestions...');
		updatePipeline(runId, { status: 'suggesting' });

		const suggestions = await step.run('generate-suggestions', async () => {
			debugLog(runId, 'Calling OpenAI generateSuggestions...');
			const result = await generateSuggestions(namedCharacters);
			debugLog(runId, `Got ${result.length} suggestion(s): ${result.map((s) => s.title).join(', ')}`);
			return result;
		});

		// Update storage AFTER step completes
		updatePipeline(runId, {
			suggestions,
			status: 'waiting-for-selection',
		});

		// Step 3: Wait for user to select a story
		debugLog(runId, 'Waiting for user to select a story...');
		const selectionEvent = await step.waitForEvent(
			'wait-for-story-selection',
			{
				event: 'pipeline/story-selected',
				timeout: '30m',
				match: 'data.runId',
			},
		);

		if (!selectionEvent) {
			updatePipeline(runId, {
				status: 'error',
				error: 'Story selection timed out after 30 minutes',
			});
			return { error: 'timeout' };
		}

		const selectedIndex = selectionEvent.data.storyIndex;
		const selectedSuggestion = suggestions[selectedIndex];
		debugLog(runId, `Story selected: #${selectedIndex} — "${selectedSuggestion.title}"`);

		updatePipeline(runId, {
			selectedStoryIndex: selectedIndex,
			status: 'waiting-for-style',
		});

		// Step 4: Wait for user to select a style
		debugLog(runId, 'Waiting for user to select a style...');
		const styleEvent = await step.waitForEvent(
			'wait-for-style-selection',
			{
				event: 'pipeline/style-selected',
				timeout: '30m',
				match: 'data.runId',
			},
		);

		if (!styleEvent) {
			updatePipeline(runId, {
				status: 'error',
				error: 'Style selection timed out after 30 minutes',
			});
			return { error: 'timeout' };
		}

		const selectedStyleId = styleEvent.data.styleId;
		const selectedStyle = STORY_STYLES.find((s) => s.id === selectedStyleId) ?? STORY_STYLES[0];
		debugLog(runId, `Style selected: "${selectedStyle.name}" (${selectedStyleId})`);

		updatePipeline(runId, {
			selectedStyleId,
			status: 'generating-story',
		});

		// Step 5: Generate the story
		debugLog(runId, 'Step 5: Generating story with OpenAI...');
		const pages = await step.run('generate-story', async () => {
			debugLog(runId, `Calling generateStory for ${PAGE_COUNT} page(s)...`);
			const result = await generateStory(namedCharacters, selectedSuggestion, selectedStyle.imageStylePrompt);
			debugLog(runId, `Story generated: ${result.length} page(s)`);
			return result;
		});

		// Update storage AFTER step completes
		updatePipeline(runId, {
			pages,
			imageProgress: { completed: 0, total: PAGE_COUNT },
			status: 'generating-images',
		});

		// Step 6: Generate image for page 0
		// NOTE: style reference is loaded inside the step to avoid exceeding
		// Inngest's 512KB step output limit (reference images can be several MB).
		debugLog(runId, 'Step 6: Generating image for page 0 via Replicate...');
		const imageUrl = await step.run('generate-image-0', async () => {
			const page = pages[0];
			debugLog(runId, `Loading style reference for "${selectedStyleId}"...`);
			const refBuffer = await getStylePreviewBuffer(selectedStyleId);
			debugLog(runId, refBuffer ? `Style reference loaded (${refBuffer.length} bytes)` : 'No style reference found in DB');
			debugLog(runId, `Calling Replicate generateImage (ref: ${refBuffer ? 'yes' : 'no'})...`);
			const url = await generateImage(page.imagePrompt, refBuffer ?? undefined);
			debugLog(runId, `Image generated: ${url.slice(0, 80)}...`);
			return url;
		});

		// Update storage AFTER step completes
		const updatedPages = pages.map((p, i) =>
			i === 0 ? { ...p, imageUrl } : p,
		);

		updatePipeline(runId, {
			pages: updatedPages,
			imageProgress: { completed: 1, total: PAGE_COUNT },
		});

		broadcast(runId, {
			type: 'image-complete',
			data: { pageNumber: 0, imageUrl },
		});

		// Mark pipeline as complete
		debugLog(runId, 'Pipeline complete!');
		updatePipeline(runId, { status: 'complete' });

		return {
			runId,
			characters: namedCharacters,
			suggestions,
			selectedStoryIndex: selectedIndex,
			pages: updatedPages,
		};
	},
);
