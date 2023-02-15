const generateSummary = require("./generateSummary");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { pdfText, temperature, max_tokens, top_p, frequency_penalty, presence_penalty } = req.body;

    try {
        const [summary, retriedCount] = await generateSummary(pdfText, temperature, max_tokens, top_p, frequency_penalty, presence_penalty);
		context.res = {
			status: 200,
            body: {
                summary,
                retriedCount
            },
            headers: {
				"Content-Type": "application/json"
			}
		};
	}
	catch (ex) {
		context.res = {
			status: 500,
            body: ex.response.data,
            headers: {
				"Content-Type": "application/json"
			}
		};
	}
}