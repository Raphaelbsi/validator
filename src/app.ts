import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { processCSVData } from './services/csvService';
import { formatToBRL, validarPrestacoes, validateCNPJ, validateCPF } from './utils/validation';
import { InvalidResult, ValidResult } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.get('/process-csv', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, onlyValid = 'false' } = req.query;
    const data = await processCSVData('data.csv');

    const validResults: ValidResult[] = [];
    const invalidResults: InvalidResult[] = [];

    data.forEach(row => {
      const { nrCpfCnpj, vlTotal, qtPrestacoes, vlPresta } = row;

      const isCPF = nrCpfCnpj.length === 11 ? validateCPF(nrCpfCnpj) : false;
      const isCNPJ = nrCpfCnpj.length === 14 ? validateCNPJ(nrCpfCnpj) : false;

      if (!isCPF && !isCNPJ) {
        invalidResults.push({ nrCpfCnpj, error: 'CPF ou CNPJ inválido' });
      }

      const total = parseFloat(vlTotal);
      const prestacoes = parseInt(qtPrestacoes);
      const valorPresta = parseFloat(vlPresta);

      if (!validarPrestacoes(total, prestacoes, valorPresta)) {
        invalidResults.push({ nrCpfCnpj, error: 'Inconsistência nos valores de prestações' });
      }

      const totalFormatado = formatToBRL(total);
      const valorPrestaFormatado = formatToBRL(valorPresta);

      validResults.push({
        nrCpfCnpj,
        vlTotal: totalFormatado,
        qtPrestacoes,
        vlPresta: valorPrestaFormatado,
      });
    });

    const sortedResults = onlyValid === 'true' ? validResults : [...validResults, ...invalidResults];

    res.json({
      data: sortedResults,
    });
  } catch (error) {
    console.error('Erro ao processar CSV:', error);
    res.status(500).json({ error: 'Erro ao processar CSV' });
  }
});


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (filePath) {
      const data = await processCSVData(filePath);
      res.json({ data });
    } else {
      res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    res.status(500).json({ error: 'Erro ao processar o arquivo CSV' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
