import {api} from "../boot/axios.js"
export default class Produto {
  static list(){
    return api.get('/produtos?with=produto_variantes')
  }
  static create(data){
    return api.post('/produtos',data)
  }
  static update(id,data){
    return api.post('/produtos/'+id,data);
  }
  static show(id){
    return api.get('/produtos/'+id+'?with=produto_variantes');
  }
}
