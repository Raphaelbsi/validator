import express from 'express';
import { processCSVData } from './services/csvService';
import { formatToBRL, validarPrestacoes, validateCNPJ, validateCPF } from './utils/validation';
import { paginate } from './utils/pagination';
import { InvalidResult, ValidResult } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

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

    const pageInt = parseInt(page as string, 10);
    const pageSizeInt = parseInt(pageSize as string, 10);
    const paginatedResults = paginate(sortedResults, pageInt, pageSizeInt);

    const totalItems = sortedResults.length;
    const totalPages = Math.ceil(totalItems / pageSizeInt);

    res.json({
      data: paginatedResults,
      metadata: {
        totalItems,
        totalPages,
        currentPage: pageInt,
        pageSize: pageSizeInt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar CSV' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

