export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const digito1 = calcDV(cpf.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digito2 = calcDV(cpf.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

  return cpf.endsWith(`${digito1}${digito2}`);

}

export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14) return false;

  const base = cnpj.slice(0, 12);
  const digito1 = calcDV(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digito2 = calcDV(base + digito1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return cnpj.endsWith(`${digito1}${digito2}`);
}



export function validarPrestacoes(vlTotal: number, qtPrestacoes: number, vlPresta: number): boolean {
  const valorCalculado = vlTotal / qtPrestacoes;
  return Math.abs(valorCalculado - vlPresta) < 0.01;
}


export function formatToBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}


export function calcDV(base: string, pesos: number[]): number {
  let soma = base
    .split('')
    .map((num, index) => parseInt(num) * pesos[index])
    .reduce((acc, curr) => acc + curr, 0);

  let resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

