export interface Payload {
    url: string;
  }

  export class UrlUploadProcessor {
    /**
     * Processes an uploaded file and returns the extracted URLs.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    public static uploadMultipleUrls(req: Request): Promise<void>;
  }
  
  import { Request, Response } from 'express';
  