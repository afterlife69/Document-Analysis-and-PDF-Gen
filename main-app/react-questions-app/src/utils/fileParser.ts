function parseFile(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const questions = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            resolve(questions);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
}

export { parseFile };