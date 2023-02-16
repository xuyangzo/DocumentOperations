// Get the prefix for the prompt
function getPromptPreix(numOfPages) {
    const tobIntro = "First, remember that a good table of contents should be concise and informative, highlighting the main topics covered in the document and making it easy for readers to find specific information. The sections listed in the table of contents should be ordered in a logical and hierarchical manner, with major sections and subsections clearly identified.In addition, the table of contents should accurately reflect the content of the document, and it should be updated if any changes are made to the organization or structure of the document. Finally, the formatting and style of the table of contents should be consistent with the overall design of the document, using headings, page numbers, and indentation to clearly differentiate between sections and subsections.\n\n";
    const outputDescription = `Then, create a table of contents for the following document. The output is a JSON array. The objects in the JSON array has a property of name "title" that is the abstract. The objects in the JSON array has another property of name "index" that is the page number. The "title" property should be less than 4 words if possible. If the outline has subtitles, the subtitle should be the "children" property of the object and it is a JSON array. The value of "children" property is of the same type as its parent object. If the outline has no subtitles, no "children" property should exist in the JSON. We should have as few as subtitles possible. The "index" property of objects in "children" property should be equal to or greater than its parent's "index" property's value. The start "index"  is 1. The value of "index" should not be greater than ${numOfPages} and this is a hard request. Here is an example JSON file:\n\n`;
    const sampleJson = `[{"title":"test","index":1},{"title":"test","index":2,"children":[{"title":"test children","index":2}]},{"title":"test","index":3}]\n\n`;
    const promptPrefix = tobIntro + outputDescription + sampleJson;

    return promptPrefix;
}

module.exports = {
    getPromptPreix
};