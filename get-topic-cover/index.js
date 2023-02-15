const generateTopicCover = require("./generateTopicCover");

module.exports = async function (context, req) {
	context.log('JavaScript HTTP trigger function processed a request.');
	
	const { prompt, size } = req.body;

	try {
		const [imageUrl, retriedCount] = await generateTopicCover(prompt, size);
		context.res = {
			status: 200,
			body: {
				url: imageUrl,
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