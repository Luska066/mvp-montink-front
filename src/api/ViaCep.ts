import {api} from "../boot/axios.js"
export default class ViaCep{
  static buscar(cep){
    return api.get('https://viacep.com.br/ws/'+cep+"/json/")
  }
}
