import Replicate from 'replicate';

const replicate = new Replicate();

export async function generateImage(
	prompt: string,
	styleReference?: Buffer,
): Promise<string> {
	const input: Record<string, unknown> = {
		prompt,
		aspect_ratio: '4:3',
		output_format: 'png',
	};

	if (styleReference) {
		const base64 = styleReference.toString('base64');
		const dataUri = `data:image/png;base64,${base64}`;
		input.reference_images = [dataUri];
	}

	const output = await replicate.run('google/nano-banana-pro', { input });

	// FileOutput objects coerce to their URL string via String()
	return String(output);
}
