const generateOutline = require("./generateOutline");

module.exports = async function (context, req) {
	context.log('JavaScript HTTP trigger function processed a request.');

	const { pages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty } = req.body;

	try {
		const [outline, retriedCount] = await generateOutline(pages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty);
		context.res = {
			status: 200,
			body: {
				outline,
				retriedCount
			},
			headers: {
				"Content-Type": "application/json"
			}
		};
	}
	catch (ex) {
		console.log(ex);
		context.res = {
			status: 500,
			body: ex.response ? ex.response.data : ex,
			headers: {
				"Content-Type": "application/json"
			}
		};
	}
}