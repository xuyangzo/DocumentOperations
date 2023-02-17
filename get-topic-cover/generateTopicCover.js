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
async function generateTopicCover(topic, size) {
	// Setting default value
	const targetSize = sizeMap[size ? size : "small"];

	try {
		const args = {
			topic,
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
		const { topic, targetSize } = args;

		const prompt = await generateImagePrompt(topic);
		const response = await openai.createImage({
			prompt,
			n: 1,
			size: targetSize,
		});

		if (response !== null &&
			response.data !== null &&
			response.data.data !== null &&
			response.data.data.length > 0)
		{
			const imageItem = {
				url: response.data.data[0].url,
				prompt
			}
			return [imageItem, 3-retryCount];
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

// Generate the prompt to be given to DALL-E
async function generateImagePrompt(topic) {
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: `Think of a summary to describle the term "${topic}". Then generate a prompt to be given to DALL-E 2 to generate an image about this term based on the summary you just thought of. The prompt should be visually descriptive and avoid any explicit references to text. We want no text to be displayed on the generated image. The promot should be a string with double quotes around.`,
		temperature: 0.5,
		max_tokens: 128,
		top_p: 1,
		frequency_penalty: 0.8,
		presence_penalty: 0
	});

	if (response &&
		response.data &&
		response.data.choices &&
		response.data.choices.length > 0)
	{
		return response.data.choices[0].text.trim().replace(/"/g, "");
	}

	// If no meaning prompt is given, should throw
	const errMessage = "No prompt for image generation is generated";
	const ex = new Error(errMessage);
	ex.response = {
		data: {
			message: errMessage
		}
	};
	throw ex;
}

module.exports = generateTopicCover;