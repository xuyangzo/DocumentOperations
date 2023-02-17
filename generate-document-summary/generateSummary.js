const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate document summary
async function generateSummary(pdfText, temperature, max_tokens, top_p, frequency_penalty, presence_penalty) {
	// Setting default value
	const targetPdfText = pdfText.length > 6400 ? pdfText.slice(0, 6400) : pdfText;
	const targetTemperature = temperature ? Number(temperature) : 0.7;
	const targetMaxTokens = max_tokens ? Number(max_tokens) : 512;
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
			targetPresencePenalty
		};
    	
		return await execute(args, 3);
    }
    catch (ex) {
        throw ex;
    }
}

// Execute summary generation by calling openai's API
async function execute(args, retryCount) {
    try {
        const { targetPdfText, targetTemperature, targetMaxTokens, targetTopP, targetFrequencyPenalty, targetPresencePenalty } = args;
		const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: getSummaryWithPrefix(targetPdfText),
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
            return [parseSummary(response.data.choices[0].text), 3-retryCount];
        }

        // There are no meaningful data in the response. Should throw
        const errMessage = "No keywords is contained in the OPENAI API response.";
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


// Get summary prefix
function getSummaryWithPrefix(pdfText) {
	const summaryPrefix = "Summarize the following document for a high school student in one or two sentence: \n\n";
	return summaryPrefix + pdfText;
}

// Parse summary to eliminate new line characters at beginning and end
function parseSummary(summary) {
    return summary.trim();
}

module.exports = generateSummary;