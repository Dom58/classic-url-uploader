import fs from 'fs';

export interface Payload {
  url: string;
}

export const isSupportedFileType = (mimeType: string | false): boolean => {
  const supportedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  return mimeType ? supportedTypes.includes(mimeType) : false;
};

export const deleteFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error(`Error deleting file: ${err}`);
    }
  });
};

export const uniqueUrlsPayload = (payload: Payload[]): Payload[] => {
  return Array.from(new Map(payload.map(item => [item.url, item])).values());
};

export const findDuplicatesWebsites = (payload: Payload[]): Payload[] => {
  const urlCount = new Map<string, number>();
  payload.forEach(item => {
    const currentCount = urlCount.get(item.url) || 0;
    urlCount.set(item.url, currentCount + 1);
  });

  return payload.filter(item => {
    const count = urlCount.get(item.url);
    return count !== undefined && count > 1;
  });
};
