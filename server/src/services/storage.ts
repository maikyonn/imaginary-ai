import {
	type PipelineState,
	type SSEEvent,
	type PipelineStatus,
	createInitialState,
} from '@childrenbook/shared/types/pipeline';

const pipelines = new Map<string, PipelineState>();
const images = new Map<string, Buffer[]>();
const subscribers = new Map<string, Set<(event: SSEEvent) => void>>();

export function createPipeline(runId: string): PipelineState {
	const state = createInitialState(runId);
	pipelines.set(runId, state);
	return state;
}

export function getPipeline(runId: string): PipelineState | undefined {
	return pipelines.get(runId);
}

export function updatePipeline(
	runId: string,
	updates: Partial<PipelineState>,
): void {
	let current = pipelines.get(runId);
	if (!current) {
		current = createInitialState(runId);
		pipelines.set(runId, current);
	}

	const updated = { ...current, ...updates };
	pipelines.set(runId, updated);

	// Broadcast relevant SSE events based on what changed
	if (updates.status) {
		broadcast(runId, { type: 'status', data: { status: updates.status } });
	}
	if (updates.characters) {
		broadcast(runId, {
			type: 'characters',
			data: { characters: updates.characters },
		});
	}
	if (updates.suggestions) {
		broadcast(runId, {
			type: 'suggestions',
			data: { suggestions: updates.suggestions },
		});
	}
	if (updates.pages) {
		broadcast(runId, { type: 'pages', data: { pages: updates.pages } });
	}
	if (updates.imageProgress) {
		broadcast(runId, {
			type: 'image-progress',
			data: updates.imageProgress,
		});
	}
	if (updates.error) {
		broadcast(runId, { type: 'error', data: { message: updates.error } });
	}
}

export function storeImages(runId: string, imageBuffers: Buffer[]): void {
	images.set(runId, imageBuffers);
}

export function getImages(runId: string): Buffer[] | undefined {
	return images.get(runId);
}

export function subscribe(
	runId: string,
	callback: (event: SSEEvent) => void,
): () => void {
	if (!subscribers.has(runId)) {
		subscribers.set(runId, new Set());
	}
	subscribers.get(runId)!.add(callback);

	return () => {
		const subs = subscribers.get(runId);
		if (subs) {
			subs.delete(callback);
			if (subs.size === 0) {
				subscribers.delete(runId);
			}
		}
	};
}

export function broadcast(runId: string, event: SSEEvent): void {
	const subs = subscribers.get(runId);
	if (subs) {
		for (const callback of subs) {
			callback(event);
		}
	}
}

export function debugLog(runId: string, message: string): void {
	const msg = `[${new Date().toISOString()}] ${message}`;
	console.log(`[debug:${runId.slice(0, 8)}] ${message}`);
	broadcast(runId, {
		type: 'debug',
		data: { message: msg, timestamp: Date.now() },
	});
}
