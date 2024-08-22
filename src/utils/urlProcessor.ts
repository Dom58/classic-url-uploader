import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { lookup } from 'mime-types';
import {
    isSupportedFileType,
    deleteFile,
    uniqueUrlsPayload,
    findDuplicatesWebsites
} from './fileHandler';
import { Payload } from './fileHandler';
interface MulterRequest extends Request {
    file: Express.Multer.File;
}

export class UrlUploadProcessor {
    public static async uploadMultipleUrls(req: MulterRequest, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file to be uploaded' });
                return;
            }

            const mimeType = lookup(req.file.originalname);

            if (!mimeType || typeof mimeType !== 'string' || !isSupportedFileType(mimeType)) {
                res.status(400).json({ error: 'Unsupported file type, file should be CSV/Excel' });
                deleteFile(req.file.path);
                return;
            }

            const filePath = req.file.path;
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
                deleteFile(req.file.path);
            }
        }
    }
}
