import {api} from "../boot/axios.js"
export default class ProdutoService{
  static list(){
    return api.get('/produtos?with=produto_variantes')
  }
}
