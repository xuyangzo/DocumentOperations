const generateKeywords = require("./generateTopics");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const { pdfText, temperature, max_tokens, top_p, frequency_penalty, presence_penalty } = req.body;

    try {
        const [topics, retriedCount] = await generateKeywords(pdfText, temperature, max_tokens, top_p, frequency_penalty, presence_penalty);
		context.res = {
			status: 200,
            body: {
                topics,
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
			body: {
				status: 500,
				message: ex.response ? ex.response.data : ex.message
			},
            headers: {
				"Content-Type": "application/json"
			}
		};
	}
}