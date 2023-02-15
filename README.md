# Document Operation APIs

### Generate Document Summary

```http
GET/POST https://pdf-fhl-operations.azurewebsites.net/api/generate-document-summary
Content-Type: application/json
```
**Request Body**

| Name | Type | Description | Range | Required | Default |
| :--- | :--- | :---------- | :---- | :------- | :------ |
| pdfText     | string | The PDF text for analysis | | Yes | |
| temperature | float  | Controls randomness: the lower, the more deterministic and repetitive | 0-1 | No | 0.7 |
| max_tokens  | int    | Max number of tokens to generate | 0-2048 | No | 128 |
| top_p       | float  | Controls diversity via nucleus sampling | 0-1 | No | 1 |
| frequency_penalty | float | How much to penalize new tokens based on existing frequency | 0-2 | No | 0 |
| presence_penalty  | float | How much to penalize new tokens based on whether they exist in text so far | 0-2 | No | 0 |

**Request Example**

```json
POST https://pdf-fhl-operations.azurewebsites.net/api/generate-document-summary

{
    "pdfText": "asd,114514",
    "temperature": 0.7,
    "max_tokens": 128,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
}
```

**Response Body**

| Name | Type | Description |
| :--- | :--- | :---------- |
| summary     | string | The document summary generated |
| retriedCount | int  | The number of retries made |

**Response Example**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "summary": "The Super Bowl is a cultural event that has become more than just a day.",
    "retriedCount": 0
}
```