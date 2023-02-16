const { Configuration, OpenAIApi } = require("openai");
const { promptPrefix } = require("./constants");
require('dotenv').config();

// Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate document outline
async function generateOutline(pages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty) {
	// Setting default value
	const targetTemperature = temperature ? Number(temperature) : 0.7;
	const targetMaxTokens = max_tokens ? Number(max_tokens) : 256;
	const targetTopP = top_p ? Number(top_p) : 1
	const targetFrequencyPenalty = frequency_penalty ? Number(frequency_penalty) : 0;
	const targetPresencePenalty = presence_penalty ? Number(presence_penalty) : 0;

	try {
		const args = {
			pages,
			targetTemperature,
			targetMaxTokens,
			targetTopP,
			targetFrequencyPenalty,
			targetPresencePenalty
		};
    	
		return await execute(args, 3);
	}
	catch (ex) {
		throw ex;
	}
}

// Execute outline generation by calling openai's API
async function execute(args, retryCount) {
	try {
		const { pages, targetTemperature, targetMaxTokens, targetTopP, targetFrequencyPenalty, targetPresencePenalty } = args;
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: getPrompt(pages),
			temperature: targetTemperature,
			max_tokens: targetMaxTokens,
			top_p: targetTopP,
			frequency_penalty: targetFrequencyPenalty,
			presence_penalty: targetPresencePenalty,
		});

		return [parseResponse(response), 3-retryCount];
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

// Get prompt
function getPrompt(pages) {
	let prompt = promptPrefix;

	for (let i = 0; i < pages.length; ++i) {
		const pageIndex = `The content of the page with index ${i} is:\n`;
		const pageText = getParsedPageText(pages[i]);

		prompt = prompt.concat(pageIndex, pageText);
	}

	return prompt.length > 7500 ? prompt.slice(0, 7500) : prompt;
}

// Get escaped page text
function getParsedPageText(text) {
  return text;
}

// Parse response to json
function parseResponse(response) {
	const originalText = response.data.choices[0].text;

	// Remove all whitespace characters
	const processedText = originalText.replace(/[\t\n]+/ig, "");

	// Get JSON string
	const matchResults = /^[^\[]*(\[.*\])[^\]]*$/.exec(processedText);
	let outline = null;
	for (let i = 1; i >= 0; --i) {
		try {
			outline = JSON.parse(matchResults[i]);
			break;
		}
		catch (ex) {
			console.error(ex);
		}
	}

	if (outline !== null) {
		reorderOutline(outline);
		return outline;
	}

	const errMessage = "No JSON string exists in the response text.";
	const ex = new Error(errMessage);
	ex.response = {
		data: {
			message: errMessage
		}
	};
	throw ex;
}

// Reorder the result outline
function reorderOutline(outline) {
	if (!outline) {
		return;
	}

	outline.sort((a, b) => {
		return a.index - b.index;
	});

	const shouldIncreaseIndex = outline[0].index === 0;
	for (const section of outline) {
		if (shouldIncreaseIndex) {
			section.index += 1;
		}

		if (section.children) {
			reorderOutline(section.children);
		}
	}
}

module.exports = generateOutline;