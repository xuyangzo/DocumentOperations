const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// Configuration
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Size mapping
const sizeMap = {
	small: "256x256",
	medium: "512x512",
	large: "1024x1024"
};

// Generate topics cover
async function generateTopicCover(topic, summaries, size) {
	// Setting default value
	const targetSize = sizeMap[size ? size : "small"];

	try {
		const args = {
			topic,
			summaries,
			targetSize
		};
    	
		return await execute(args, 3);
	}
	catch (ex) {
		throw ex;
	}
}

// Execute the topic cover generation by calling openai's API
async function execute(args, retryCount) {
	try {
		const { topic, summaries, targetSize } = args;
		const response = await openai.createImage({
			prompt: generatePrompt(topic, summaries),
			n: 1,
			size: targetSize,
		});

		if (response !== null &&
			response.data !== null &&
			response.data.data !== null &&
			response.data.data.length > 0)
		{
			return [response.data.data[0].url, 3-retryCount];
		}

		// This means no image is generated.
		const errMessage = "No image is generated.";
		const ex = new Error(errMessage);
		ex.response = {
			data: {
				message: errMessage
			}
		};
		throw ex;
	}
	catch (ex) {
		retryCount--;

		// We do not process anymore
		if (retryCount === 0) {
			console.error(ex.response ? ex.response.data : ex);
			throw ex;
		}
		// Keep retrying
		else {
			console.error(`Retrying! RetryCount remaining: ${retryCount}`);
			return await execute(args, retryCount);
		}
	}
}

// Generate prompt for image generation
function generatePrompt(topic, summaries) {
	// TODO: add logic to generate the prompt
	return topic;
}

module.exports = generateTopicCover;