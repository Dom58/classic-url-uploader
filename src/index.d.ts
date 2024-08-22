// src/index.d.ts

// Define the Payload interface
export interface Payload {
    url: string;
  }
  
  // Define the UrlUploadProcessor class
  export class UrlUploadProcessor {
    /**
     * Processes an uploaded file and returns the extracted URLs.
     * @param req - The Express request object.
     * @param res - The Express response object.
     */
    public static uploadMultipleUrls(req: Request, res: Response): Promise<void>;
  }
  
  // Importing Request and Response from 'express' for type definitions
  import { Request, Response } from 'express';
  