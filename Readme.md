# URL Uploader

A Node.js package for processing uploaded CSV or Excel files containing URLs.

## prerequisites
- Your file should be CSV or Excel
- The file should have a `url` column

Example of the file: `example.csv`


| No         | url             |  other colums... |
| ---         |     ---      |          --- |
| 1   | https://www.example1.com     |  |
| 2     | https://www.example2.com      |    |
| 3   | https://www.example1.com     |  |
| 4     | https://www.example3.com       |   |
| 5   | https://www.example1.com     |    |
| 6     | https://www.example3.com      | |

## Installation

```bash
npm install classic-url-uploader
pnpm add classic-url-uploader
yarn add classic-url-uploader
```

## Usage in your project
```bash
import { UrlUploadProcessor } from "classic-url-uploader";
```

### In your controller of somewhere you need to use the Package
```bash
const result = await UrlUploadProcessor.uploadMultipleUrls(request as Request)
console.log(result);
```
Result should be error or data in the file

### Sample of the result

#### Errors
##### 1. When the file is not CSV or Excel file
```bash
{
  status: 400,
  error: 'Unsupported file type, file should be CSV/Excel'
}
```

##### 2. When there is an Internal server error
```bash
{
  status: 500,
  error: 'Internal server error'
}
```

#### Data response
##### 1. Read data in CSV or EXCEL file with no duplicated data
```bash
{
  status: 200,
  message: 'File processed successfully',
  data: [
    { url: 'https://www.example1.com' },
    { url: 'https://www.example2.com' }
  ],
  duplicatedWebsites: []
}
```

##### 2. Read data in CSV or EXCEL file with duplicated urls data
```bash
{
  status: 200,
  message: 'File processed successfully',
  data: [
    { url: 'https://www.example1.com' },
    { url: 'https://www.example2.com' }
  ],
  duplicatedWebsites: [
    { url: 'https://www.example1.com' },
    { url: 'https://www.example1.com' },
    { url: 'https://www.example1.com' }
  ]
}
```
