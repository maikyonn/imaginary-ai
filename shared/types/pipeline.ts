// ── Pipeline Status ──────────────────────────────────────────────

export type PipelineStatus =
	| 'idle'
	| 'uploading'
	| 'characterizing'
	| 'waiting-for-names'
	| 'suggesting'
	| 'waiting-for-selection'
	| 'waiting-for-style'
	| 'generating-story'
	| 'generating-images'
	| 'complete'
	| 'error';

// ── Story Styles ────────────────────────────────────────────────

export interface StoryStyle {
	id: string;
	name: string;
	description: string;
	imageStylePrompt: string;
}

export const STORY_STYLES: StoryStyle[] = [
	{
		id: 'disney-classic',
		name: 'Disney Classic',
		description: 'Magical, painterly scenes like classic Disney animated films',
		imageStylePrompt: 'Disney classic animation style, lush painted backgrounds, warm cinematic lighting, expressive round eyes, rich saturated colors, magical sparkle effects, storybook fairy tale illustration',
	},
	{
		id: 'berenstain-bears',
		name: 'Berenstain Bears',
		description: 'Cozy, pen-and-ink family scenes with warm watercolor fills',
		imageStylePrompt: 'Berenstain Bears style illustration, pen and ink outlines with warm watercolor washes, cozy domestic scenes, soft earthy tones, friendly rounded character shapes, wholesome family storybook',
	},
	{
		id: 'dr-seuss',
		name: 'Dr. Seuss',
		description: 'Wacky, imaginative worlds with wild shapes and bright colors',
		imageStylePrompt: 'Dr. Seuss style illustration, whimsical exaggerated architecture, curvy impossible shapes, bold ink linework, bright contrasting colors, zany playful energy, fantastical nonsensical landscape',
	},
	{
		id: 'eric-carle',
		name: 'Eric Carle',
		description: 'Bold, layered tissue-paper collage like The Very Hungry Caterpillar',
		imageStylePrompt: 'Eric Carle style illustration, painted tissue paper collage, bold layered cutout shapes, vibrant saturated colors, visible paper texture, simple graphic compositions, tactile craft aesthetic',
	},
	{
		id: 'studio-ghibli',
		name: 'Studio Ghibli',
		description: 'Lush, hand-painted anime worlds full of wonder and nature',
		imageStylePrompt: 'Studio Ghibli anime style, lush hand-painted watercolor backgrounds, detailed natural scenery, soft ambient lighting, expressive anime characters, whimsical magical realism, serene atmospheric',
	},
	{
		id: 'pixar',
		name: 'Pixar',
		description: 'Vibrant 3D-rendered characters with big eyes and warm lighting',
		imageStylePrompt: 'Pixar 3D animation style, vibrant saturated colors, soft volumetric lighting, expressive stylized characters with large eyes, smooth rounded shapes, cinematic depth of field, heartwarming scene',
	},
	{
		id: 'goodnight-moon',
		name: 'Goodnight Moon',
		description: 'Simple, warm gouache paintings with a gentle bedtime glow',
		imageStylePrompt: 'Goodnight Moon style illustration, simple flat gouache painting, warm muted palette with pops of red and green, cozy interior scenes, soft glowing lamplight, gentle bedtime storybook, mid-century picture book',
	},
	{
		id: 'curious-george',
		name: 'Curious George',
		description: 'Clean ink outlines with cheerful yellow and primary color washes',
		imageStylePrompt: 'Curious George style illustration, clean simple ink outlines, cheerful primary color watercolor washes, bright yellow accents, playful character poses, simple white backgrounds, classic mid-century children\'s book',
	},
	{
		id: 'comic-book',
		name: 'Comic Book',
		description: 'Action-packed panels with bold outlines and dynamic poses',
		imageStylePrompt: 'children\'s comic book illustration, bold black ink outlines, dynamic action poses, bright pop art colors, halftone dot shading, dramatic angles, speech bubble style, superhero adventure storybook',
	},
	{
		id: 'maurice-sendak',
		name: 'Where the Wild Things Are',
		description: 'Dense, crosshatched pen drawings with earthy, dreamlike tones',
		imageStylePrompt: 'Maurice Sendak style illustration, dense crosshatched pen and ink, earthy muted tones with rich greens and browns, wild fantastical creatures, dreamlike forest settings, textured shadowy atmosphere, classic picture book',
	},
	{
		id: 'caricature',
		name: 'Caricature',
		description: 'Fun, exaggerated features with big heads and playful proportions',
		imageStylePrompt: 'caricature illustration style, exaggerated facial features, oversized heads on small bodies, playful distorted proportions, bold expressive lines, bright cheerful colors, humorous cartoon portrait, children\'s storybook',
	},
	{
		id: 'ultra-realistic',
		name: 'Ultra Realistic',
		description: 'Photorealistic illustrations that look like real photographs',
		imageStylePrompt: 'ultra realistic photographic style, hyperrealistic detail, natural lighting, shallow depth of field, lifelike skin textures, vivid true-to-life colors, professional portrait photography, cinematic realism',
	},
	{
		id: 'watercolor-whimsy',
		name: 'Watercolor Whimsy',
		description: 'Loose, dreamy watercolor washes with soft flowing edges',
		imageStylePrompt: 'loose watercolor illustration, soft wet-on-wet washes, flowing paint edges, dreamy pastel palette, visible brush strokes, organic paint bleeds, gentle whimsical atmosphere, fine art children\'s book',
	},
	{
		id: 'retro-cartoon',
		name: 'Retro Cartoon',
		description: 'Vintage 1950s-style cartoons with bold lines and atomic-age charm',
		imageStylePrompt: 'retro 1950s cartoon illustration, bold clean outlines, limited color palette, mid-century modern design, atomic age aesthetic, vintage advertising style, rounded friendly shapes, nostalgic Americana storybook',
	},
	{
		id: 'manga',
		name: 'Manga',
		description: 'Expressive Japanese manga style with dynamic lines and sparkles',
		imageStylePrompt: 'manga illustration style, expressive large eyes with detailed highlights, dynamic speed lines, screentone shading, black and white ink with color accents, emotional sparkle effects, Japanese comic book storybook',
	},
];

// ── Domain Models ────────────────────────────────────────────────

export interface CharacterProfile {
	name: string;
	age: string;
	personality: string;
	physicalDescription: string;
	traits: string[];
}

export interface StorySuggestion {
	index: number;
	title: string;
	synopsis: string;
	theme: string;
	tone: string;
}

export interface StoryPage {
	pageNumber: number;
	text: string;
	imagePrompt: string;
	imageUrl?: string;
}

// ── Pipeline State ───────────────────────────────────────────────

export interface PipelineState {
	runId: string;
	status: PipelineStatus;
	characters: CharacterProfile[];
	suggestions: StorySuggestion[];
	selectedStoryIndex: number | null;
	selectedStyleId: string | null;
	pages: StoryPage[];
	imageProgress: { completed: number; total: number };
	error: string | null;
	createdAt: number;
}

export function createInitialState(runId: string): PipelineState {
	return {
		runId,
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
}

// ── SSE Event Types ──────────────────────────────────────────────

export type SSEEvent =
	| { type: 'status'; data: { status: PipelineStatus } }
	| { type: 'characters'; data: { characters: CharacterProfile[] } }
	| { type: 'suggestions'; data: { suggestions: StorySuggestion[] } }
	| { type: 'pages'; data: { pages: StoryPage[] } }
	| { type: 'image-complete'; data: { pageNumber: number; imageUrl: string } }
	| { type: 'image-progress'; data: { completed: number; total: number } }
	| { type: 'error'; data: { message: string } }
	| { type: 'debug'; data: { message: string; timestamp: number } }
	| { type: 'heartbeat'; data: Record<string, never> };

// ── API Request / Response Types ─────────────────────────────────

export interface StartPipelineResponse {
	runId: string;
}

export interface ConfirmNamesRequest {
	names: string[];
}

export interface ConfirmNamesResponse {
	ok: boolean;
}

export interface SelectStoryRequest {
	storyIndex: number;
}

export interface SelectStoryResponse {
	ok: boolean;
}

export interface PipelineStatusResponse {
	state: PipelineState;
}

// ── Inngest Event Types ──────────────────────────────────────────

export interface PipelineStartedEvent {
	name: 'pipeline/started';
	data: {
		runId: string;
	};
}

export interface NamesConfirmedEvent {
	name: 'pipeline/names-confirmed';
	data: {
		runId: string;
		names: string[];
	};
}

export interface StorySelectedEvent {
	name: 'pipeline/story-selected';
	data: {
		runId: string;
		storyIndex: number;
	};
}

export interface StyleSelectedEvent {
	name: 'pipeline/style-selected';
	data: {
		runId: string;
		styleId: string;
	};
}

// ── Constants ────────────────────────────────────────────────────

/** Number of pages to generate (1 for testing, 10 for production) */
export const PAGE_COUNT = 1;
