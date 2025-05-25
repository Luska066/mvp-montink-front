export default class StringUtils {
  static currencyBrl(value) {
    return value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
  }

   static currencyBrlConfig() {
      return {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2,
        masked: false  // se quiser só o número no model (ex: 1234.56)
      }
  }

  static unmaskCurrency(val){
    return parseFloat(val
      .replace(/\s/g, '')        // remove espaços
      .replace('R$', '')         // remove o prefixo
      .replace(/\./g, '')        // remove os separadores de milhar
      .replace(',', '.') )        // troca vírgula por ponto decimal
  }
}
