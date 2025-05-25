import {api} from "../boot/axios.js"

export default class Checkout{
  static checkout(data){
    return api.post('/checkout', data)
  }

  static aplicarCupom(subtotal,code){
    return api.post('/checkout/discount',{
      code: code,
      subtotal: subtotal
    })
  }
}
