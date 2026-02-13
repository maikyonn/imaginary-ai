let files = $state<File[]>([]);

export function setUploadedFiles(newFiles: File[]) {
	files = newFiles;
}

export function getUploadedFiles(): File[] {
	return files;
}

export function clearUploadedFiles() {
	files = [];
}
