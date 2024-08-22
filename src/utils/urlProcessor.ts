import { Request } from 'express';
import * as XLSX from 'xlsx';
import { lookup } from 'mime-types';
import {
    isSupportedFileType,
    deleteFile,
    uniqueUrlsPayload,
    findDuplicatesWebsites
} from './fileHandler';
import { Payload } from './fileHandler';

export class UrlUploadProcessor {
    public static async uploadMultipleUrls(req: Request): Promise<any> {
        try {
            if (!req.file) {
                return { status: 400, error: 'No file to be uploaded' };
            }

            const mimeType = lookup(req.file.originalname);

            if (!mimeType || typeof mimeType !== 'string' || !isSupportedFileType(mimeType)) {
                // if (req.file.path) {
                //     deleteFile(req.file.path);
                // }
                return { status: 400, error: 'Unsupported file type, file should be CSV/Excel' };
            }

            const filePath = req.file.path;
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data: any[] = XLSX.utils.sheet_to_json(worksheet);

            const payload: Payload[] = data.map((row: any) => ({ url: row.url }));
            const uniquePayload = uniqueUrlsPayload(payload);
            const duplicatedWebsites = findDuplicatesWebsites(payload);

            return {
                status: 200,
                message: 'File processed successfully',
                data: uniquePayload,
                duplicatedWebsites
            };
        } catch (error) {
            console.error('====Internal server error====', error);
            return { status: 500, error: 'Internal server error' };
        } finally {
            if (req.file) {
                deleteFile(req.file.path);
            }
        }
    }
}
