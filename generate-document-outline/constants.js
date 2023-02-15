const tobIntro = "First, remember that a good table of contents should be concise and informative, highlighting the main topics covered in the document and making it easy for readers to find specific information. The sections listed in the table of contents should be ordered in a logical and hierarchical manner, with major sections and subsections clearly identified.In addition, the table of contents should accurately reflect the content of the document, and it should be updated if any changes are made to the organization or structure of the document. Finally, the formatting and style of the table of contents should be consistent with the overall design of the document, using headings, page numbers, and indentation to clearly differentiate between sections and subsections.\n\n";
const createSentence = "Then, create a table of contents for the following document.";
const outputDescription = "The output is a JSON array. The objects in the JSON array has a property of name \"title\" that is the abstract. The objects in the JSON array has another property of name \"index\" that is the page index. The key property should be less than 4 words if possible. The start index is 1.\n\n";
const promptPrefix = tobIntro + createSentence + outputDescription;

module.exports = {
    promptPrefix
};