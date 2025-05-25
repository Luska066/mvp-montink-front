import {api} from "../boot/axios.js"
export default class Pedidos {
  static list(){
    return api.get('/pedido?with=pedidos_items.produto,pedidos_items.produto_variante,pedidos_items.pedido')
  }
  static approve(id){
    return api.get('/pedidos/'+id+'/approve');
  }
  static cancel(id){
    return api.get('/pedidos/'+id+'/cancel');
  }
}
