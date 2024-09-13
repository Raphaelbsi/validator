import express from 'express';
import { processCSVData } from './services/csvService';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/process-csv', async (req, res) => {
  try {
    await processCSVData();
    res.send('CSV Processado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao processar CSV');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
