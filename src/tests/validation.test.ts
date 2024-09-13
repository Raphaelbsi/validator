import { validateCPF, validateCNPJ } from '../utils/validation';

describe('Validação de CPF', () => {
  it('deve validar um CPF válido', () => {
    expect(validateCPF('12345678909')).toBe(true);
  });

  it('deve retornar falso para um CPF inválido', () => {
    expect(validateCPF('12345678900')).toBe(false);
  });
});

describe('Validação de CNPJ', () => {
  it('deve validar um CNPJ válido', () => {
    expect(validateCNPJ('12345678000195')).toBe(true);
  });

  it('deve retornar falso para um CNPJ inválido', () => {
    expect(validateCNPJ('12345678000100')).toBe(false);
  });
});
