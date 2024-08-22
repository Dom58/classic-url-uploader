// src/utils/urlProcessor.ts

import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { lookup } from 'mime-types';
import { isSupportedFileType, deleteFile, uniqueUrlsPayload, findDuplicatesWebsites } from './fileHandler';
import { Payload } from './fileHandler';

export class UrlUploadProcessor {
    public static async uploadMultipleUrls(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file to be uploaded' });
                return; // Ensure function exits after sending response
            }

            const mimeType = lookup(req.file.originalname);

            if (!mimeType || typeof mimeType !== 'string' || !isSupportedFileType(mimeType)) {
                deleteFile(req.file.path);
                res.status(400).json({ error: 'Unsupported file type' });
                return; // Ensure function exits after sending response
            }

            const filePath = req.file.path;
            // path.join(__dirname, '../../uploads', path.basename(req.file.path));
            // const filePath = path.join(__dirname, '../../uploads', req.file.path);
            if (!fs.existsSync(filePath)) {
                console.error(`File does not exist at path 1: ${filePath}`);
                res.status(500).json({ error: 'File not found' });
                return;
            }

            console.error(`File does not exist at path 2: ${filePath}`);

            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data: any[] = XLSX.utils.sheet_to_json(worksheet);

            const payload: Payload[] = data.map((row: any) => ({ url: row.url }));
            const uniquePayload = uniqueUrlsPayload(payload);
            const duplicatedWebsites = findDuplicatesWebsites(payload);

            res.status(200).json({
                message: 'File processed successfully',
                data: uniquePayload,
                duplicatedWebsites
            });
        } catch (error) {
            console.error('====Internal server error====', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            if (req.file) {
                console.log('=====file===', req.file.path);
                // deleteFile(req.file.path);
            }
        }
    }
}
