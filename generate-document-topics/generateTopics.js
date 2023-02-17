const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate document summary
async function generateKeywords(pdfText, getImages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty) {
	// Setting default value
	const targetPdfText = pdfText.length > 6400 ? pdfText.slice(0, 6400) : pdfText;
	const targetTemperature = temperature ? Number(temperature) : 0.7;
	const targetMaxTokens = max_tokens ? Number(max_tokens) : 128;
	const targetTopP = top_p ? Number(top_p) : 1
	const targetFrequencyPenalty = frequency_penalty ? Number(frequency_penalty) : 0;
	const targetPresencePenalty = presence_penalty ? Number(presence_penalty) : 0;

    try {
        const args = {
			targetPdfText,
			targetTemperature,
			targetMaxTokens,
			targetTopP,
			targetFrequencyPenalty,
			targetPresencePenalty,
			getImages
		};
    	
		return await execute(args, 3);
    }
    catch (ex) {
        throw ex;
    }
}

// Execute keywords generation by calling openai's API
async function execute(args, retryCount) {
    try {
		const {
			targetPdfText, targetTemperature, targetMaxTokens, targetTopP,
			targetFrequencyPenalty, targetPresencePenalty, getImages
		} = args;
		const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: getKeywordsWithPrefix(targetPdfText),
            temperature: targetTemperature,
            max_tokens: targetMaxTokens,
            top_p: targetTopP,
            frequency_penalty: targetFrequencyPenalty,
            presence_penalty: targetPresencePenalty
        });
          
        if (response !== null &&
            response.data !== null &&
            response.data.choices !== null &&
            response.data.choices.length > 0)
		{
			const keywordsStr = response.data.choices[0].text;
			const keywords = parseKeywords(keywordsStr);

			if (!getImages) {
				return [keywords, 3 - retryCount];
			}

			// Get all topics with images
			const imagePrompts = await generateImagePrompts(keywords);
			const topicsWithImages = await generateTopicsWithImages(keywords, imagePrompts);
            return [topicsWithImages, 3-retryCount];
        }

        // There are no meaningful data in the response. Should throw
        const errMessage = "No keywords in represented in the OPENAI API response.";
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


// Get keywords prefix
function getKeywordsWithPrefix(pdfText) {
	const keywordsPrefix = "Extract at most 5 keywords from the following text. The output should be a list of keywords separated by a comma. Order the output by how much the keyword describes the text. The keyword that best describes the text should be ordered first. The number of keywords extracted should be no more than 5: \n\n";
	return keywordsPrefix + pdfText;
}

// Parse keywords
function parseKeywords(keywordsStr) {
	const parsedStr = keywordsStr.replace(/\n/ig, "");
	const keywords = parsedStr.split(",").filter(x => x).map(keyword => keyword.trim());
	return keywords.slice(0, 5);
}

// Generate a list of images with topics
async function generateTopicsWithImages(keywords, prompts) {
	const generateImageEvents = prompts.map(prompt => generateImageAsync(prompt));
	const results = await Promise.allSettled(generateImageEvents);

	const topics = [];
	for (let i = 0; i < results.length; ++i) {
		const { status, value } = results[i];
		if (status === "fulfilled") {
			if (value !== null &&
				value.data !== null &&
				value.data.data !== null &&
				value.data.data.length > 0)
			{
				topics.push({
					topic: keywords[i],
					url: value.data.data[0].url
				});
			}
		}	
	}

	return topics;
}

// Generate an image based on a single topic
function generateImageAsync(prompt) {
	return openai.createImage({
		prompt,
		n: 1,
		size: "256x256",
	});
}

// Generate the list of prompts based on a list of topics
async function generateImagePrompts(keywords) {
	const generatePromptsEvents = keywords.map(keyword => generateImagePrompt(keyword));
	const results = await Promise.allSettled(generatePromptsEvents);

	const prompts = [];
	for (let i = 0; i < results.length; ++i) {
		const { status, value } = results[i];
		if (status === "fulfilled") {
			if (value &&
				value.data &&
				value.data.choices &&
				value.data.choices.length > 0)
			{
				prompts.push(value.data.choices[0].text);
			}
		}	
	}

	return prompts;
}

// Generate the DALLE prompt based on a single topic
function generateImagePrompt(keyword) {
	return openai.createCompletion({
		model: "text-davinci-003",
		prompt: `Think of a summary to describle the term "${keyword}". Then generate a prompt to be given to DALL-E 2 to generate an image about this term based on the summary you just thought of. The prompt should be visually descriptive and avoid any explicit references to text. We want no text to be displayed on the generated image. The promot should be a string with double quotes around.`,
		temperature: 0.5,
		max_tokens: 128,
		top_p: 1,
		frequency_penalty: 0.8,
		presence_penalty: 0
	});
}

module.exports = generateKeywords;