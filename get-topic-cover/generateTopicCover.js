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
async function generateTopicCover(prompt, num, size) {
	// Setting default value
	const targetSize = sizeMap[size ? size : "small"];
	const targetNum = num ? parseInt(num) : 1;

	try {
		const response = await openai.createImage({
			prompt,
			n: targetNum,
			size: targetSize,
		});

		return response;
	}
	catch (ex) {
		console.error("Open AI error detected!");
		console.error(ex.response.data);

		throw ex;
	}
}

module.exports = generateTopicCover;