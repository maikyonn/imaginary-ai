import type {
	PipelineState,
	PipelineStatus,
	SSEEvent,
} from '@childrenbook/shared/types/pipeline';
import * as api from '$lib/api/client';

const INITIAL_STATE: PipelineState = {
	runId: '',
	status: 'idle',
	characters: [],
	suggestions: [],
	selectedStoryIndex: null,
	selectedStyleId: null,
	pages: [],
	imageProgress: { completed: 0, total: 0 },
	error: null,
	createdAt: Date.now(),
};

let state = $state<PipelineState>({ ...INITIAL_STATE });
let debugLogs = $state<string[]>([]);
let sseCleanup: (() => void) | null = null;

export function getPipelineState(): PipelineState {
	return state;
}

export function getDebugLogs(): string[] {
	return debugLogs;
}

function addDebugLog(message: string) {
	debugLogs = [...debugLogs, message];
}

export async function startPipeline(images: File[]) {
	state.status = 'uploading';
	state.error = null;
	debugLogs = [];

	addDebugLog(`[client] Uploading ${images.length} image(s)...`);

	try {
		const { runId } = await api.startPipeline(images);
		addDebugLog(`[client] Upload complete. runId: ${runId}`);
		state.runId = runId;
		state.status = 'characterizing';

		addDebugLog(`[client] Connecting SSE to /api/pipeline/${runId}/events`);
		sseCleanup = api.connectSSE(runId, handleSSEEvent);
	} catch (err) {
		const msg = err instanceof Error ? err.message : 'Failed to start pipeline';
		addDebugLog(`[client] ERROR: ${msg}`);
		state.error = msg;
		state.status = 'error';
	}
}

export async function confirmNames(names: string[]) {
	if (!state.runId) return;

	try {
		await api.confirmNames(state.runId, names);
	} catch (err) {
		state.error = err instanceof Error ? err.message : 'Failed to confirm names';
		state.status = 'error';
	}
}

export async function selectStory(index: number) {
	if (!state.runId) return;

	state.selectedStoryIndex = index;

	try {
		await api.selectStory(state.runId, index);
	} catch (err) {
		state.error = err instanceof Error ? err.message : 'Failed to select story';
		state.status = 'error';
	}
}

export async function selectStyle(styleId: string) {
	if (!state.runId) return;

	state.selectedStyleId = styleId;

	try {
		await api.selectStyle(state.runId, styleId);
	} catch (err) {
		state.error = err instanceof Error ? err.message : 'Failed to select style';
		state.status = 'error';
	}
}

function handleSSEEvent(event: SSEEvent) {
	switch (event.type) {
		case 'status':
			addDebugLog(`[sse] status → ${event.data.status}`);
			state.status = event.data.status;
			break;
		case 'characters':
			addDebugLog(`[sse] characters received: ${event.data.characters.length}`);
			state.characters = event.data.characters;
			break;
		case 'suggestions':
			addDebugLog(`[sse] suggestions received: ${event.data.suggestions.length}`);
			state.suggestions = event.data.suggestions;
			break;
		case 'pages':
			addDebugLog(`[sse] pages received: ${event.data.pages.length}`);
			state.pages = event.data.pages;
			break;
		case 'image-complete': {
			addDebugLog(`[sse] image-complete page ${event.data.pageNumber}`);
			const page = state.pages.find((p) => p.pageNumber === event.data.pageNumber);
			if (page) {
				page.imageUrl = event.data.imageUrl;
			}
			break;
		}
		case 'image-progress':
			addDebugLog(`[sse] image-progress ${event.data.completed}/${event.data.total}`);
			state.imageProgress = event.data;
			break;
		case 'error':
			addDebugLog(`[sse] ERROR: ${event.data.message}`);
			state.error = event.data.message;
			state.status = 'error';
			break;
		case 'debug':
			addDebugLog(`[server] ${event.data.message}`);
			break;
		case 'heartbeat':
			break;
	}
}

export function resetPipeline() {
	sseCleanup?.();
	sseCleanup = null;
	state = { ...INITIAL_STATE, createdAt: Date.now() };
	debugLogs = [];
}
