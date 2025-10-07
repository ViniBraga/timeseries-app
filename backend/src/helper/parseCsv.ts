import fs from 'fs';
import csv from 'csv-parser';

export type CSVRow = {
  ts: string;
  [key: string]: string;
};

export const parseCsvFile = (filePath: string): Promise<CSVRow[]> => {
  const rows: CSVRow[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
};