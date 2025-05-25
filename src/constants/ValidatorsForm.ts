import moment from 'moment';

export type ValidatorsType = {
  required: (val: string) => string | boolean;
  email: (val: string) => string | boolean;
  validateCpf: (val: string) => string | boolean;
  validateCnpj: (val: string) => string | boolean;
  validateDatePt_br: (val: string) => string | boolean;
  cep: (val: string) => string | boolean;
  telefone: (val: string) => string | boolean;
  celular: (val: string) => string | boolean;
  validateUmaLetraMinuscula: (val: string) => string | boolean;
  validateUmaLetraMaiuscula: (val: string) => string | boolean;
  validateUmNumero: (val: string) => string | boolean;
  validateUmCaracterEspecial: (val: string) => string | boolean;
  validateOitoCaracteres: (val: string) => string | boolean;
  validarCpfCalc: (val: string) => string | boolean;
  validarCnpjCalc: (val: string) => string | boolean;
  validateActualYear: (val: string) => string | boolean;
  validateActualMonth: (val: string) => string | boolean;
  validateMaskToken: (val: string) => string | boolean;
  validarCartaoCredito: (val: string) => string | boolean;
  validateMinCaracteres: (val: string) => string | boolean;
  validateMaxCaracteres: (val: string) => string | boolean;
};

export const REMOVER_CARACTERES_NAO_NUMERICOS = /[^\d]+/g;
const UMA_LETRA_MINUSCULA = /(?=.*[a-z])/;
const UMA_LETRA_MAIUSCULA = /(?=.*[A-Z])/;
const UM_NUMERO = /(?=.*\d)/;
const UM_CARACTERE_ESPECIAL = /(?=.*[@$!%*?&])/;
const MIN_OITO_CARACTERES = /^[A-Za-z\d@$!%*?&]{8,}$/;
const TOKEN = /^\d{4}-\d{4}$/;
export const MASK_CNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;

export const ValidatorsForm: ValidatorsType = {
  required: (val: string) => (val && val.length > 0) || 'O campo é obrigatório',
  requiredFile: (val) => val != null || 'O campo é obrigatório',
  email: (val: string) => /.+@.+\..+/.test(val) || 'Email inválido',
  validateCpf: (val: string) => {
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/; // Formato: XXX.XXX.XXX-XX

    return cpfPattern.test(val) || 'Cpf ou CNPJ invâlido';
  },
  validateCnpj: (val: string) => {
    const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/; // Formato: XX.XXX.XXX/XXXX-XX
    return cnpjPattern.test(val) || 'CNPJ invâlido';
  },
  validateDatePt_br: (val: string) =>
    moment(val, 'DD/MM/YYYY').isValid() || 'Data inválida',
  cep: (val: string) => {
    const cepPattern = /^\d{5}\-\d{3}$/;
    return cepPattern.test(val) || 'Cep invâlido';
  },
  validateUmaLetraMinuscula: (val: string) => {
    const regex = UMA_LETRA_MINUSCULA;
    return regex.test(val) || 'O campo deve conter uma letra minuscula';
  },
  validateUmaLetraMaiuscula: (val: string) => {
    const regex = UMA_LETRA_MAIUSCULA;
    return regex.test(val) || 'O campo deve conter uma letra maiúscula';
  },
  validateUmNumero: (val: string) => {
    const regex = UM_NUMERO;
    return regex.test(val) || 'O campo deve conter um número';
  },
  validateUmCaracterEspecial: (val: string) => {
    const regex = UM_CARACTERE_ESPECIAL;
    return regex.test(val) || 'O campo deve conter um caracter especial';
  },
  validateOitoCaracteres: (val: string) => {
    const regex = MIN_OITO_CARACTERES;
    return regex.test(val) || 'O campo deve conter 8 ou mais caracteres';
  },
  telefone: (val: string) => {
    const phonePattern = /^\(\d{2}\) \d{4}\-\d{4}$/; // Formato: (XX) XXXX-XXXX
    return (
      phonePattern.test(val) ||
      'Telefone inválido. Use o formato (XX) XXXX-XXXX'
    );
  },
  celular: (val: string) => {
    const mobilePattern = /^\(\d{2}\) \d{1}\ \d{4}\-\d{4}$/; // Formato: (XX) XXXXX-XXXX
    return (
      mobilePattern.test(val) ||
      'Celular inválido. Use o formato (XX) XXXXX-XXXX'
    );
  },
  validarCpfCalc: (val: string): boolean | string => {
    val = val.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (val.length !== 11 || /^(\d)\1+$/.test(val)) return false; // Verifica sequência repetida

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(val[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(val[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(val[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(val[10]);
  },

  // Função para validar CNPJ
  validarCnpjCalc: (cnpj: string): boolean | string => {
    cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false; // Verifica sequência repetida

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros[tamanho - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos[0])) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros[tamanho - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos[1]);
  },
  validateActualYear: (val) => {
    const yearActual = moment().year();
    return (
      String(yearActual) <= val ||
      'O Ano precisar ser igual ou maior que : ' + yearActual
    );
  },
  validateActualMonth: (val) => {
    const monthActual = moment().month();
    return (
      String(monthActual) <= val  ||
      'O Ano precisar ser igual ou maior que : ' + monthActual
    );
  },
  validateMaskToken: (val) => {
    return TOKEN.test(val) || 'Token inválido !';
  },
  validarCartaoCredito: (numero) => {
    numero = numero.replace(/\D/g, ''); // Remove tudo que não for dígito
    let soma = 0;
    let alternar = false;

    for (let i = numero.length - 1; i >= 0; i--) {
      let n = parseInt(numero[i], 10);
      if (alternar) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      soma += n;
      alternar = !alternar;
    }

    return soma % 10 === 0 || "Cartão de Crédito Inválido, Verifique os Dígitos";
  },
  validateMinCaracteres: (val) => {
    return val.length > 50 || "O campo precisa ter no mínimo 50 caracteres";
  },
  validateMaxCaracteres: (val) => {
    return val.length < 500 || "O campo precisa ter no mínimo 500 caracteres";
  }
};
