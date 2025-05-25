import {api} from "../boot/axios.js"

export default class Cupom {
  static list(){
    return api.get('/coupons')
  }
  static create(data){
    return api.post('/coupons',data)
  }
  static delete(id){
    return api.delete('/coupons/'+id);
  }

}
