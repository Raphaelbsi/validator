import express from 'express';
import { processCSVData } from './services/csvService';
import { formatToBRL, validarPrestacoes, validateCNPJ, validateCPF } from './utils/validation';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/process-csv', async (req, res) => {
  try {
    const data = await processCSVData('data.csv');

    data.forEach(row => {
      const { nrCpfCnpj, vlTotal, qtPrestacoes, vlPresta } = row;

      const isCPF = nrCpfCnpj.length === 11 ? validateCPF(nrCpfCnpj) : false;
      const isCNPJ = nrCpfCnpj.length === 14 ? validateCNPJ(nrCpfCnpj) : false;

      if (!isCPF && !isCNPJ) {
        console.log(`CPF ou CNPJ inválido: ${nrCpfCnpj}`);
      }

      const total = parseFloat(vlTotal);
      const prestacoes = parseInt(qtPrestacoes);
      const valorPresta = parseFloat(vlPresta);

      if (!validarPrestacoes(total, prestacoes, valorPresta)) {
        console.log(`Inconsistência nos valores de prestações para ${nrCpfCnpj}`);
      }

      const totalFormatado = formatToBRL(total);
      const valorPrestaFormatado = formatToBRL(valorPresta);

      console.log(`CPF/CNPJ: ${nrCpfCnpj} | Total: ${totalFormatado} | Prestação: ${valorPrestaFormatado}`);
    });

    res.send('Processamento de CSV concluído com sucesso.');
  } catch (error) {
    res.status(500).send('Erro ao processar CSV');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
