import fs from 'fs';
import csvParser from 'csv-parser';

export async function processCSVData(): Promise<void> {
  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream('data.csv')
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log('CSV Processado');
        resolve();
      })
      .on('error', (error) => reject(error));
  });
}
