import type {
	PipelineState,
	SSEEvent,
	StartPipelineResponse,
	SelectStoryResponse,
	PipelineStatusResponse,
} from '@childrenbook/shared/types/pipeline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function startPipeline(images: File[]): Promise<StartPipelineResponse> {
	const form = new FormData();
	for (const image of images) {
		form.append('images', image);
	}

	const res = await fetch(`${API_URL}/api/pipeline/start`, {
		method: 'POST',
		body: form,
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Failed to start pipeline: ${res.status} ${body}`);
	}

	return res.json();
}

export async function confirmNames(runId: string, names: string[]): Promise<{ ok: boolean }> {
	const res = await fetch(`${API_URL}/api/pipeline/${runId}/confirm-names`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ names }),
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Failed to confirm names: ${res.status} ${body}`);
	}

	return res.json();
}

export async function selectStory(runId: string, storyIndex: number): Promise<SelectStoryResponse> {
	const res = await fetch(`${API_URL}/api/pipeline/${runId}/select-story`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ storyIndex }),
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Failed to select story: ${res.status} ${body}`);
	}

	return res.json();
}

export async function selectStyle(runId: string, styleId: string): Promise<{ ok: boolean }> {
	const res = await fetch(`${API_URL}/api/pipeline/${runId}/select-style`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ styleId }),
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Failed to select style: ${res.status} ${body}`);
	}

	return res.json();
}

export async function getStatus(runId: string): Promise<PipelineState> {
	const res = await fetch(`${API_URL}/api/pipeline/${runId}/status`);

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Failed to get status: ${res.status} ${body}`);
	}

	const data: PipelineStatusResponse = await res.json();
	return data.state;
}

export function connectSSE(runId: string, onEvent: (event: SSEEvent) => void): () => void {
	const source = new EventSource(`${API_URL}/api/pipeline/${runId}/events`);

	const eventTypes = [
		'status',
		'characters',
		'suggestions',
		'pages',
		'image-complete',
		'image-progress',
		'error',
		'debug',
		'heartbeat',
	] as const;

	for (const type of eventTypes) {
		source.addEventListener(type, (e: MessageEvent) => {
			try {
				const data = JSON.parse(e.data);
				onEvent({ type, data } as SSEEvent);
			} catch {
				// ignore unparseable messages
			}
		});
	}

	source.onopen = () => {
		console.log('[SSE] Connection opened');
	};

	source.onerror = (e) => {
		console.error('[SSE] Connection error', e);
		console.log('[SSE] readyState:', source.readyState);
	};

	return () => source.close();
}
