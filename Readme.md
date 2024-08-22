# URL Uploader

A Node.js package for processing uploaded CSV or Excel files containing URLs.

## Installation

```bash
npm install classic-url-uploader
```

```bash
import { UrlUploadProcessor } from "classic-url-uploader";
```

```bash
router.post('/upload',
  upload.single('file'),
  UrlUploadProcessor.uploadMultipleUrls
);
```
