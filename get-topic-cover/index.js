const generateTopicCover = require("./generateTopicCover");

module.exports = async function (context, req) {
	context.log('JavaScript HTTP trigger function processed a request.');
	
	const { prompt, num, size } = y;
	req.quer
	try {
		const response = await generateTopicCover(prompt, num, size);
		context.res = {
			status: 200,
            body: response.data,
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