import { processCSVData } from '../services/csvService';
import fs from 'fs';

jest.mock('fs');

describe('processCSV', () => {
  it('deve processar um CSV corretamente', async () => {
    const mockStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn(),
    };

    (mockStream.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'data') {
        callback({ nrCpfCnpj: '12345678909', vlTotal: '1000', qtPrestacoes: '10', vlPresta: '100' });
      } else if (event === 'end') {
        callback();
      }
      return mockStream;
    });

    (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

    const data = await processCSVData('fakepath.csv');

    expect(data).toEqual([
      { nrCpfCnpj: '12345678909', vlTotal: '1000', qtPrestacoes: '10', vlPresta: '100' },
    ]);
  });

  it('deve lidar com erros ao processar o CSV', async () => {
    const mockStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn(),
    };

    (mockStream.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'error') {
        callback(new Error('Erro ao ler arquivo'));
      }
      return mockStream;
    });

    (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

    await expect(processCSVData('fakepath.csv')).rejects.toThrow('Erro ao ler arquivo');
  });
});
