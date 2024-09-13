import fs from 'fs';
import csvParser from 'csv-parser';


interface CSVData {
  nrCpfCnpj: string;
  vlTotal: string;
  qtPrestacoes: string;
  vlPresta: string;
  [key: string]: string;
}


export async function processCSVData(path: string): Promise<CSVData[]> {
  const results: CSVData[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
}
