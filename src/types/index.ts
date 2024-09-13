export type ValidResult = {
  nrCpfCnpj: string;
  vlTotal: string;
  qtPrestacoes: string;
  vlPresta: string;
};

export type InvalidResult = {
  nrCpfCnpj: string;
  error: string;
};
