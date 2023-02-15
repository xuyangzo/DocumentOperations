# Document Operation APIs

**APIs**

[Generate Document Topics](#generate-document-topics)

[Generate Document Summary](#generate-document-summary)

[Generate Document Outline](#generate-document-outline)

[Generate Topic Cover](#generate-topic-cover)

### Generate Document Topics

```http
GET https://pdf-fhl-operations.azurewebsites.net/api/generate-document-topics
POST https://pdf-fhl-operations.azurewebsites.net/api/generate-document-topics
Content-Type: application/json
```
**Request Body**

| Name | Type | Description | Range | Required | Default |
| :--- | :--- | :---------- | :---- | :------- | :------ |
| pdfText     | string | The PDF text for analysis. | | Yes | |
| temperature | float  | Controls randomness: the lower, the more deterministic and repetitive. | 0-1 | No | 0.7 |
| max_tokens  | int    | Max number of tokens to generate. | 0-2048 | No | 128 |
| top_p       | float  | Controls diversity via nucleus sampling. | 0-1 | No | 1 |
| frequency_penalty. | float | How much to penalize new tokens based on existing frequency. | 0-2 | No | 0 |
| presence_penalty  | float | How much to penalize new tokens based on whether they exist in text so far. | 0-2 | No | 0 |

**Request Example**

```http
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
| topics       | string[] | The topics generated. |
| retriedCount | int  | The number of retries made. |

**Response Example**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "topics": [
        "Super Bowl",
        "commercials",
        "Maya Rudolph",
        "Kevin Bacon",
        "Budweiser"
    ],
    "retriedCount": 0
}
```

### Generate Document Summary

```http
GET https://pdf-fhl-operations.azurewebsites.net/api/generate-document-summary
POST https://pdf-fhl-operations.azurewebsites.net/api/generate-document-summary
Content-Type: application/json
```
**Request Body**

| Name | Type | Description | Range | Required | Default |
| :--- | :--- | :---------- | :---- | :------- | :------ |
| pdfText     | string | The PDF text for analysis. | | Yes | |
| temperature | float  | Controls randomness: the lower, the more deterministic and repetitive. | 0-1 | No | 0.7 |
| max_tokens  | int    | Max number of tokens to generate. | 0-2048 | No | 128 |
| top_p       | float  | Controls diversity via nucleus sampling. | 0-1 | No | 1 |
| frequency_penalty. | float | How much to penalize new tokens based on existing frequency. | 0-2 | No | 0 |
| presence_penalty  | float | How much to penalize new tokens based on whether they exist in text so far. | 0-2 | No | 0 |

**Request Example**

```http
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
| summary     | string | The document summary generated. |
| retriedCount | int  | The number of retries made. |

**Response Example**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "summary": "The Super Bowl is a cultural event that has become more than just a day.",
    "retriedCount": 0
}
```

### Generate Document Outline

```http
GET https://pdf-fhl-operations.azurewebsites.net/api/generate-document-outline
POST https://pdf-fhl-operations.azurewebsites.net/api/generate-document-outline
Content-Type: application/json
```
**Request Body**

| Name | Type | Description | Range | Required | Default |
| :--- | :--- | :---------- | :---- | :------- | :------ |
| pages       | string[] | The list of page texts of the document. | | Yes | |
| temperature | float  | Controls randomness: the lower, the more deterministic and repetitive. | 0-1 | No | 0.7 |
| max_tokens  | int    | Max number of tokens to generate. | 0-2048 | No | 128 |
| top_p       | float  | Controls diversity via nucleus sampling. | 0-1 | No | 1 |
| frequency_penalty | float | How much to penalize new tokens based on existing frequency. | 0-2 | No | 0 |
| presence_penalty  | float | How much to penalize new tokens based on whether they exist in text so far. | 0-2 | No | 0 |

**Request Example**

```http
POST https://pdf-fhl-operations.azurewebsites.net/api/generate-document-outline

{
    "pages": [
        "The foreign color is red.",
        "A dragon excapes from the wild."
    ],
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
| outline     | object[] | The document outline generated. The object key is the abstract and the object value is the page index. |
| retriedCount | int  | The number of retries made. |

**Response Example**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "outline": [
        {
            "API Tensions": 0
        },
        {
            "Test Balloons with Fire": 1
        },
        {
            "Mysterious Objects": 2
        }
    ],
    "retriedCount": 0
}
```

### Generate Topic Cover

```http
GET https://pdf-fhl-operations.azurewebsites.net/api/get-topic-cover
POST https://pdf-fhl-operations.azurewebsites.net/api/get-topic-cover
Content-Type: application/json
```
**Request Body**

| Name | Type | Description | Range | Required | Default |
| :--- | :--- | :---------- | :---- | :------- | :------ |
| prompt  | string | The prompt to generate the topic cover | | Yes | |
| size    | string | The size of the image to generate. Small=256x256. Medium=512x512. Large=1024x1024 | small/medium/large | No | small |

**Request Example**

```http
POST https://pdf-fhl-operations.azurewebsites.net/api/get-topic-cover

{
    "prompt": "a cow eating grass"
}
```

**Response Body**

| Name | Type | Description |
| :--- | :--- | :---------- |
| url     | string | The url of the image generated. Will expire in 1 hour. |
| retriedCount | int  | The number of retries made. |

**Response Example**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-CaWH1M5DUQPpn0LEvSV00yBb/user-hRnjLvLcHCBtJTkEOOhOtzvg/img-G9RwkGS62oVRXy7rYOdhddC3.png?st=2023-02-15T04%3A39%3A40Z&se=2023-02-15T06%3A39%3A40Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-02-15T02%3A29%3A23Z&ske=2023-02-16T02%3A29%3A23Z&sks=b&skv=2021-08-06&sig=17mtmKkZccudUsW%2BfWA1WV56o1BfpdNsN%2ByJz7wEcKU%3D",
    "retriedCount": 0
}
```

### Error Response

```http
HTTP/1.1 500 Internal Error

{
    "status": 500,
    "message": "Index out of range."
}
```