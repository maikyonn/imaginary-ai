import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { inngest } from '../inngest/client.js';
import {
	createPipeline,
	getPipeline,
	storeImages,
	subscribe,
	debugLog,
} from '../services/storage.js';
import type {
	StartPipelineResponse,
	SelectStoryResponse,
	PipelineStatusResponse,
	SSEEvent,
} from '@childrenbook/shared/types/pipeline';

const pipeline = new Hono();

// POST /start — upload images and kick off the pipeline
pipeline.post('/start', async (c) => {
	const formData = await c.req.formData();
	const files = formData.getAll('images');

	if (files.length === 0) {
		return c.json({ error: 'No images uploaded' }, 400);
	}

	const imageBuffers: Buffer[] = [];
	for (const file of files) {
		if (file instanceof File) {
			const arrayBuffer = await file.arrayBuffer();
			imageBuffers.push(Buffer.from(arrayBuffer));
		}
	}

	if (imageBuffers.length === 0) {
		return c.json({ error: 'No valid image files found' }, 400);
	}

	const runId = crypto.randomUUID();
	createPipeline(runId);
	storeImages(runId, imageBuffers);

	debugLog(runId, `Pipeline created with ${imageBuffers.length} image(s)`);

	// Fire Inngest event to start the pipeline
	try {
		debugLog(runId, 'Sending pipeline/started event to Inngest...');
		await inngest.send({
			name: 'pipeline/started',
			data: { runId },
		});
		debugLog(runId, 'Inngest event sent successfully');
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		debugLog(runId, `Inngest send FAILED: ${msg}`);
		throw err;
	}

	return c.json({ runId } satisfies StartPipelineResponse);
});

// GET /:runId/status — get current pipeline state
pipeline.get('/:runId/status', (c) => {
	const runId = c.req.param('runId');
	const state = getPipeline(runId);

	if (!state) {
		return c.json({ error: 'Pipeline not found' }, 404);
	}

	return c.json({ state } satisfies PipelineStatusResponse);
});

// POST /:runId/confirm-names — user confirms/edits character names
pipeline.post('/:runId/confirm-names', async (c) => {
	const runId = c.req.param('runId');
	const state = getPipeline(runId);

	if (!state) {
		return c.json({ error: 'Pipeline not found' }, 404);
	}

	const body = await c.req.json<{ names: string[] }>();

	await inngest.send({
		name: 'pipeline/names-confirmed',
		data: { runId, names: body.names },
	});

	return c.json({ ok: true });
});

// POST /:runId/select-story — user selects a story suggestion
pipeline.post('/:runId/select-story', async (c) => {
	const runId = c.req.param('runId');
	const state = getPipeline(runId);

	if (!state) {
		return c.json({ error: 'Pipeline not found' }, 404);
	}

	const body = await c.req.json<{ storyIndex: number }>();

	await inngest.send({
		name: 'pipeline/story-selected',
		data: { runId, storyIndex: body.storyIndex },
	});

	return c.json({ ok: true } satisfies SelectStoryResponse);
});

// POST /:runId/select-style — user selects an illustration style
pipeline.post('/:runId/select-style', async (c) => {
	const runId = c.req.param('runId');
	const state = getPipeline(runId);

	if (!state) {
		return c.json({ error: 'Pipeline not found' }, 404);
	}

	const body = await c.req.json<{ styleId: string }>();

	await inngest.send({
		name: 'pipeline/style-selected',
		data: { runId, styleId: body.styleId },
	});

	return c.json({ ok: true });
});

// GET /:runId/events — SSE stream for real-time updates
pipeline.get('/:runId/events', (c) => {
	const runId = c.req.param('runId');
	const state = getPipeline(runId);

	if (!state) {
		return c.json({ error: 'Pipeline not found' }, 404);
	}

	return streamSSE(c, async (stream) => {
		// Send current state immediately
		await stream.writeSSE({
			event: 'status',
			data: JSON.stringify({ status: state.status }),
		});

		if (state.characters.length > 0) {
			await stream.writeSSE({
				event: 'characters',
				data: JSON.stringify({ characters: state.characters }),
			});
		}

		if (state.suggestions.length > 0) {
			await stream.writeSSE({
				event: 'suggestions',
				data: JSON.stringify({ suggestions: state.suggestions }),
			});
		}

		if (state.pages.length > 0) {
			await stream.writeSSE({
				event: 'pages',
				data: JSON.stringify({ pages: state.pages }),
			});
		}

		// Subscribe to future updates
		const unsubscribe = subscribe(runId, async (event: SSEEvent) => {
			try {
				await stream.writeSSE({
					event: event.type,
					data: JSON.stringify(event.data),
				});
			} catch {
				// Stream closed, will be cleaned up
			}
		});

		// Heartbeat every 15 seconds
		const heartbeat = setInterval(async () => {
			try {
				await stream.writeSSE({
					event: 'heartbeat',
					data: JSON.stringify({}),
				});
			} catch {
				clearInterval(heartbeat);
			}
		}, 15_000);

		// Wait for the stream to close (abort signal)
		stream.onAbort(() => {
			clearInterval(heartbeat);
			unsubscribe();
		});

		// Keep the stream alive until aborted
		await new Promise<void>((resolve) => {
			stream.onAbort(() => resolve());
		});
	});
});

export default pipeline;
