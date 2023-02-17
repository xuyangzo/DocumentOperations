// Generate prompt for image generation
function generatePrompt(topic, summaries) {
	// TODO: add logic to generate the prompt
	return `Create an illustration for topics: ${topic}, no characters in image`;
}

module.exports = {
    generateDallePrompt: generatePrompt
};