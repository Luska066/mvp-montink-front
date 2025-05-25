import { defineStore, acceptHMRUpdate } from 'pinia'

export const CarrinhoStore = defineStore('CarrinhoStore', {
  state: () => ({
    produtos : []
  }),
  getters: {},
  actions: {
    adicionarProdutos(produto) {
      this.produtos.push(produto)
    },
    atualizarProdutos(index,produto) {
      this.produtos[index] = produto
    },
    limpar() {
      this.produtos = []
    },
    removerProduto(index){
      this.produtos.splice(index,1);
    }
  },
  persist: true
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(CarrinhoStore, import.meta.hot))
}
