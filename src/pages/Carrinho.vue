<script>
import {CarrinhoStore} from "stores/CarrinhoStore.js";
import StringUtils from "../constants/StringUtils.js";
import Checkout from "src/api/Checkout.js";
import {REMOVER_CARACTERES_NAO_NUMERICOS, ValidatorsForm} from "src/constants/ValidatorsForm.js";
import ViaCep from "src/api/ViaCep.js";

export default {
  name: "Carrinho",
  data() {
    return {
      cep: '',
      cidade: '',
      estado: '',
      bairro: '',
      rua: '',
      numero: '',
      complemento: '',
      email: '',
      cupom: '',
      desconto: 0,
      minValue: 0,
    }
  },
  computed: {
    ValidatorsForm() {
      return ValidatorsForm
    },
    StringUtils() {
      return StringUtils
    },
    Total() {
      return CarrinhoStore().produtos.reduce(
        (total, produto) => total + Number(produto.selected.preco) * Number(produto.selected.quantidadeParaCompra), 0)
    },
    TotalComDesconto() {
      const valorTotal = CarrinhoStore().produtos.reduce(
        (total, produto) => total + Number(produto.selected.preco) * Number(produto.selected.quantidadeParaCompra),
        0)
      if(valorTotal >= this.minValue){
        const valorDesconto = valorTotal * (this.desconto / 100);
        return valorTotal - valorDesconto
      }
      this.desconto = 0;
      return valorTotal
    },
    Frete() {
      if (this.Total > 52 && this.Total < 166.59) {
        return 15
      } else if (this.Total === 0 || this.Total > 200) {
        return 0
      } else {
        return 20
      }
    }
  },
  methods: {
    CarrinhoStore,
    aplicarCupom() {
      Checkout.aplicarCupom(this.Total, this.cupom).then(response => {
        this.desconto = response.data.desconto.toFixed(2) ?? 0
        this.minValue = response.data.min
      }).catch(() => {
        this.$q.notify({
          type: 'negative',
          message: 'Cupom inválido, ou valor inferior ao esperado'
        })
        this.cupom = '';
      })
    },
    async definirCep(){
      const cep = this.cep.replace(REMOVER_CARACTERES_NAO_NUMERICOS,'')
      if(cep.length === 8){
        const {data} = await ViaCep.buscar(cep)
        this.estado = data.uf;
        this.cidade = data.localidade; //Cidade
        this.complemento = data.complemento; //Complemento
        this.rua = data.logradouro; //Rua
      }
    },
    FinalizarPedido() {
      const result = CarrinhoStore().produtos.map((item) => {
        if (item?.selected?.produto_id) {
          return {
            produto_id: item?.selected?.produto_id,
            variante_id: item?.selected?.id,
            quantidade: item.selected.quantidadeParaCompra,
            preco: item.selected.preco,
          }
        }
        return {
          produto_id: item.id,
          variante_id: null,
          quantidade: item.selected.quantidadeParaCompra,
          preco: item.selected.preco,
        }
      })
      const data = {
        produtos: result,
        frete: this.Frete,
        total: this.Total,
        desconto: this.desconto,
        email: this.email,
        cep:this.cep.replace(REMOVER_CARACTERES_NAO_NUMERICOS,''),
        estado:this.estado,
        cidade: this.cidade,
        numero: this.numero,
        complemento:this.complemento,
        rua:this.rua
      }
      this.$q.loading.show();
      Checkout.checkout(data)
        .then(response => {
          if (response.data.code == 201) {
            this.$q.notify({
              type: 'positive',
              message: 'Pedido realizado com sucesso'
            })
            setTimeout(() => {
              this.$router.push('/')
              CarrinhoStore().limpar()
            }, 2000)
          }
        })
        .catch(error => {
          this.$q.notify({
            type: 'negative',
            message: error.response.data.message
          })
        })
        .finally(() => {
          setTimeout(() => {
            this.$q.loading.hide();
          }, 1000)
        });
    }
  }
}
</script>

<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 text-bold">
      Carrinho
    </div>
    <q-form @submit="FinalizarPedido" class="flex items-start q-gutter-x-md">
      <q-card bordered class="shadow-0 col q-mt-lg">
        <q-card-section>
          <q-item-label v-if="CarrinhoStore().produtos.length <= 0">Você ainda não possui nenhum item no carrinho
          </q-item-label>
          <div class="q-mt-md" v-for="(produto,index) in CarrinhoStore().produtos" style="border:1px solid #cdcbcb">
            <header class="bg-grey-2">
              <div class="text-body1 text-bold q-pl-md q-py-sm">
                {{ produto.nome }}
              </div>
            </header>
            <section class="q-pl-md q-pb-md q-mt-md flex items-center">
              <q-img width="140px" :src="produto.selected.imagem"/>
              <div class="column">
                <div class="q-ml-md text-h4">
                  <span class="text-bold" style="font-size: 32px">{{
                      StringUtils.currencyBrl(produto.selected.quantidadeParaCompra * produto.selected.preco)
                    }}</span>
                  <q-btn @click="() => CarrinhoStore().removerProduto(index)" icon="delete" color="dark" flat
                         class="q-ml-md" outline rounded round size="15px"></q-btn>
                </div>
                <div class="flex items-center justify-between q-ml-md q-my-sm">
                  <q-input label="Quantidade" color="grey-10" v-model="produto.selected.quantidadeParaCompra"
                           class="q-mx-none" style="max-width: 200px" outlined dense>
                    <template v-slot:prepend>
                      <q-btn
                        @click="produto.selected.quantidadeParaCompra > 1 ?produto.selected.quantidadeParaCompra-- : null"
                        icon="remove" dense flat/>
                    </template>
                    <template v-slot:append>
                      <q-btn
                        @click="produto.selected.quantidadeParaCompra < produto.selected.estoque ? produto.selected.quantidadeParaCompra++ : null"
                        icon="add" dense flat/>
                    </template>
                  </q-input>
                </div>
              </div>
            </section>
          </div>
        </q-card-section>
      </q-card>
      <div style="width: 100%;max-width: 600px" class="column justify-between full-height">
        <q-card class="shadow-0 q-pt-sm q-mb-xl q-pb-md">
          <q-card-section>
            <div>
              <q-input
                type="email"
                v-model="email"
                :rules="[
                  ValidatorsForm.required,
                  ValidatorsForm.email
                ]"
                outlined
                label="Email"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="dark" size="30px"/>
                </template>
              </q-input>
              <q-input
                v-model="cep"
                :rules="[
                  ValidatorsForm.required,
                  ValidatorsForm.cep
                ]"
                @update:model-value="definirCep"
                mask="#####-###"
                outlined
                label="CEP"
              >
                <template v-slot:prepend>
                  <q-icon name="local_shipping" color="dark" size="30px"/>
                </template>
              </q-input>
              <section class="flex q-gutter-x-sm q-mt-sm">
                <q-input
                  v-model="estado"
                  class="col"
                  :rules="[
                  ValidatorsForm.required
                ]"
                  outlined
                  label="Estado"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_shipping" color="dark" size="30px"/>
                  </template>
                </q-input>
                <q-input
                  v-model="cidade"
                  class="col"
                  :rules="[
                    ValidatorsForm.required
                  ]"
                  outlined
                  label="Cidade"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_shipping" color="dark" size="30px"/>
                  </template>
                </q-input>
                <q-input
                  v-model="numero"
                  class="col"
                  :rules="[
                  ValidatorsForm.required
                ]"
                  outlined
                  label="Número"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_shipping" color="dark" size="30px"/>
                  </template>
                </q-input>
              </section>
              <section class="flex q-mt-sm q-gutter-sm">
                <q-input
                  v-model="complemento"
                  class="col"
                  :rules="[
                  ValidatorsForm.required
                ]"
                  outlined
                  label="Complemento"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_shipping" color="dark" size="30px"/>
                  </template>
                </q-input>
                <q-input
                  v-model="rua"
                  class="col"
                  :rules="[
                  ValidatorsForm.required
                ]"
                  outlined
                  label="Rua"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_shipping" color="dark" size="30px"/>
                  </template>
                </q-input>
              </section>
            </div>

            <section class="row items-center justify-between">
              <div class="text-bold">
                Produtos ({{ CarrinhoStore().produtos.length }})
              </div>
              <div class="text-bold text-h5">
                {{ StringUtils.currencyBrl(Total) }}
              </div>
            </section>
            <section v-if="CarrinhoStore().produtos.length > 0" class="row items-center q-mt-sm justify-between">
              <div class="text-bold text-body1 text-grey-8">
                Frete
              </div>
              <div class="text-bold text-green-10 text-body1">
                {{ Frete != 0 ? StringUtils.currencyBrl(Frete) : 'Grátis' }}
              </div>
            </section>
            <section v-if="CarrinhoStore().produtos.length > 0" class="row items-center q-mt-sm justify-between">
              <div class="text-bold text-body1 text-grey-8">
                Desconto
              </div>
              <div class="text-bold text-body1">
                {{ desconto <= 0 ? "Não aplicado" : desconto+" %"  }}
              </div>
            </section>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <section class="row items-center justify-between">
              <div class="text-bold text-h5 text-grey-8">
                Total
              </div>
              <div class="text-bold text-h5">
                {{ StringUtils.currencyBrl(TotalComDesconto) }}
              </div>
            </section>
          </q-card-section>
        </q-card>
        <section class="q-mt-xl">
          <q-card bordered class="shadow-0">
            <q-form @submit="aplicarCupom">
              <q-card-section>
                <q-input
                  v-model="cupom"
                  dense
                  outlined
                  label="Cupom de desconto"
                />
                <q-btn
                  type="submit"
                  label="Aplicar cupom"
                  color="green-10"
                  outline
                  class="full-width q-mt-sm"
                />
              </q-card-section>
            </q-form>
          </q-card>
          <q-btn
            type="submit"
            label="Finalizar Pedido"
            color="green-10"
            class="full-width q-mt-sm"
          />
        </section>
      </div>
    </q-form>
  </q-page>
</template>

<style scoped>

</style>
