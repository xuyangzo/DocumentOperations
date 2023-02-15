const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate document summary
async function generateKeywords(pdfText, temperature, max_tokens, top_p, frequency_penalty, presence_penalty) {
	// Setting default value
	const targetTemperature = temperature ? Number(temperature) : 0.7;
	const targetMaxTokens = max_tokens ? Number(max_tokens) : 128;
	const targetTopP = top_p ? Number(top_p) : 1
	const targetFrequencyPenalty = frequency_penalty ? Number(frequency_penalty) : 0;
	const targetPresencePenalty = presence_penalty ? Number(presence_penalty) : 0;

    try {
        const args = {
			pdfText,
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

// Execute keywords generation by calling openai's API
async function execute(args, retryCount) {
    try {
        const { pdfText, targetTemperature, targetMaxTokens, targetTopP, targetFrequencyPenalty, targetPresencePenalty } = args;
		const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: getKeywordsWithPrefix(pdfText),
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
            return [parseKeywords(keywordsStr), 3-retryCount];
        }

        // There are no meaningful data in the response. Should throw
        const errMessage = "No keywords in represented in the OPENAI API response.";
		const ex = new Exception(errMessage);
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

module.exports = generateKeywords;