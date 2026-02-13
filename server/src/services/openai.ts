import OpenAI from 'openai';
import {
	type CharacterProfile,
	type StorySuggestion,
	type StoryPage,
	PAGE_COUNT,
} from '@childrenbook/shared/types/pipeline';

const client = new OpenAI();

export async function characterizePhotos(
	imageBuffers: Buffer[],
): Promise<CharacterProfile[]> {
	const imageContent: OpenAI.ChatCompletionContentPart[] = imageBuffers.map(
		(buf) => ({
			type: 'image_url' as const,
			image_url: {
				url: `data:image/jpeg;base64,${buf.toString('base64')}`,
				detail: 'high' as const,
			},
		}),
	);

	const response = await client.chat.completions.create({
		model: 'gpt-4o',
		response_format: { type: 'json_object' },
		messages: [
			{
				role: 'system',
				content: `You are analyzing photos for a personalized children's storybook.
Identify the main subjects in the photos (people, pets, or prominent objects) and create character profiles for a children's story.
If there are people (especially children), base the character on them. If the photos show pets, animals, or objects, turn them into story characters.
Always create at least one character, even if you need to be creative with what you see.
Return JSON with this exact structure:
{
  "characters": [
    {
      "name": "A descriptive label like 'Girl with red hair' or 'Golden retriever' to help the user identify who this is",
      "age": "A relational description like 'daughter', 'son', 'a young puppy', or 'toddler' — never specify explicit ages",
      "personality": "Inferred personality traits from the photo",
      "physicalDescription": "Detailed physical description - be specific enough for an image generator to recreate them",
      "traits": ["brave", "curious", "kind"]
    }
  ]
}`,
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Please analyze these photos and create character profiles for the main subjects you see. Turn them into characters for a children\'s storybook.',
					},
					...imageContent,
				],
			},
		],
		max_tokens: 2000,
	});

	const content = response.choices[0]?.message?.content;
	if (!content) throw new Error('No response from OpenAI characterization');

	const parsed = JSON.parse(content);
	return parsed.characters as CharacterProfile[];
}

export async function generateSuggestions(
	characters: CharacterProfile[],
): Promise<StorySuggestion[]> {
	const characterDescriptions = characters
		.map(
			(c) =>
				`${c.name} (${c.age}): ${c.personality}. Traits: ${c.traits.join(', ')}`,
		)
		.join('\n');

	const response = await client.chat.completions.create({
		model: 'gpt-4o',
		response_format: { type: 'json_object' },
		messages: [
			{
				role: 'system',
				content: `You are a creative children's book author. Generate 4 unique story suggestions based on the given characters.
Each story should be age-appropriate, imaginative, and feature the characters as heroes.
Return JSON with this exact structure:
{
  "suggestions": [
    {
      "index": 0,
      "title": "The Story Title",
      "synopsis": "A 2-3 sentence synopsis of the story",
      "theme": "friendship/adventure/courage/discovery",
      "tone": "whimsical/heartwarming/exciting/gentle"
    }
  ]
}
Generate exactly 4 suggestions with indices 0-3.`,
			},
			{
				role: 'user',
				content: `Create 4 story suggestions featuring these characters:\n${characterDescriptions}`,
			},
		],
		max_tokens: 2000,
	});

	const content = response.choices[0]?.message?.content;
	if (!content) throw new Error('No response from OpenAI suggestions');

	const parsed = JSON.parse(content);
	return parsed.suggestions as StorySuggestion[];
}

export async function generateStory(
	characters: CharacterProfile[],
	suggestion: StorySuggestion,
	imageStylePrompt: string,
): Promise<StoryPage[]> {
	const characterDescriptions = characters
		.map(
			(c) =>
				`${c.name} (${c.age}): ${c.physicalDescription}. Personality: ${c.personality}`,
		)
		.join('\n');

	const response = await client.chat.completions.create({
		model: 'gpt-4o',
		response_format: { type: 'json_object' },
		messages: [
			{
				role: 'system',
				content: `You are a talented children's book author and illustrator director.
Write a ${PAGE_COUNT}-page children's story based on the given suggestion and characters.
Each page should have engaging text (2-4 sentences suitable for reading aloud) and a detailed image prompt.
The image prompt should describe the scene vividly, referencing the characters' physical appearances exactly as described.
Image prompts MUST use exactly this style: "${imageStylePrompt}". Include character descriptions in every image prompt.

Return JSON with this exact structure:
{
  "pages": [
    {
      "pageNumber": 0,
      "text": "The story text for this page...",
      "imagePrompt": "A detailed image generation prompt describing the scene, characters, and style..."
    }
  ]
}
Generate exactly ${PAGE_COUNT} page(s) with pageNumber starting at 0.`,
			},
			{
				role: 'user',
				content: `Write a story based on:
Title: ${suggestion.title}
Synopsis: ${suggestion.synopsis}
Theme: ${suggestion.theme}
Tone: ${suggestion.tone}

Characters:
${characterDescriptions}`,
			},
		],
		max_tokens: 4000,
	});

	const content = response.choices[0]?.message?.content;
	if (!content) throw new Error('No response from OpenAI story generation');

	const parsed = JSON.parse(content);
	return parsed.pages as StoryPage[];
}
