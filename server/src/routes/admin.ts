import { Hono } from 'hono';
import { STORY_STYLES } from '@childrenbook/shared/types/pipeline';
import { generateImage } from '../services/replicate.js';
import {
	saveStylePreview,
	getStylePreview,
	getStylePreviewIds,
} from '../services/db.js';

const admin = new Hono();

const PREVIEW_PROMPT =
	'A happy family portrait of a father, mother, son, and daughter standing together in a sunny park with green trees and a bright blue sky, smiling and holding hands';

async function downloadImage(url: string): Promise<Buffer> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
	return Buffer.from(await res.arrayBuffer());
}

// GET /style-previews — list which styles have saved previews
admin.get('/style-previews', async (c) => {
	const ids = await getStylePreviewIds();
	return c.json({ styleIds: ids });
});

// GET /style-previews/:styleId — serve a saved preview image
admin.get('/style-previews/:styleId', async (c) => {
	const styleId = c.req.param('styleId');
	const preview = await getStylePreview(styleId);

	if (!preview) {
		return c.json({ error: 'No preview found' }, 404);
	}

	return new Response(preview.imageData, {
		headers: {
			'Content-Type': preview.contentType,
			'Cache-Control': 'public, max-age=86400',
		},
	});
});

// POST /generate-style-preview — generate and save a reference image for a style
admin.post('/generate-style-preview', async (c) => {
	const { styleId } = await c.req.json<{ styleId: string }>();

	const style = STORY_STYLES.find((s) => s.id === styleId);
	if (!style) {
		return c.json({ error: 'Style not found' }, 404);
	}

	const prompt = `${PREVIEW_PROMPT}. ${style.imageStylePrompt}`;
	const imageUrl = await generateImage(prompt);

	// Download and save to Postgres
	const imageData = await downloadImage(imageUrl);
	await saveStylePreview(styleId, imageData);

	return c.json({ styleId, saved: true });
});

// POST /generate-all-previews — generate and save reference images for all styles
admin.post('/generate-all-previews', async (c) => {
	const results: { styleId: string; saved: boolean; error?: string }[] = [];

	for (const style of STORY_STYLES) {
		try {
			const prompt = `${PREVIEW_PROMPT}. ${style.imageStylePrompt}`;
			const imageUrl = await generateImage(prompt);
			const imageData = await downloadImage(imageUrl);
			await saveStylePreview(style.id, imageData);
			results.push({ styleId: style.id, saved: true });
		} catch (err) {
			results.push({
				styleId: style.id,
				saved: false,
				error: err instanceof Error ? err.message : 'Unknown error',
			});
		}
	}

	return c.json({ results });
});

export default admin;
