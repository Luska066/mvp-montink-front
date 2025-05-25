<template>
  <q-page>
    <header class="flex q-gutter-x-md bg-dark text-white q-pa-md">
      <div class="text-h4 text-bold ">PRODUTOS</div>
      <q-input placeholder="FUNCIONALIDADE IMCOMPLETA" class="col" bg-color="white" color="white" outlined dense>
        <template v-slot:prepend>
          <q-icon color="dark" size="20px" name="search"/>
        </template>
      </q-input>
      <q-btn color="white" @click="() => modal = true" label="CRIAR PRODUTO" outline icon="add">
      </q-btn>
    </header>

    <!--  Produto  -->
    <section class="flex q-gutter-x-sm q-pa-sm">
      <q-card v-for="(product,index) in listaProduto" style="width: 100%;max-width: 390px" bordered class="shadow-0">
        <q-card-section>
          <q-carousel
            v-model="slide"
            swipeable
            animated
            control-type="flat"
            control-color="dark"
            padding
            height="200px"
            style="border-bottom:1px solid black;border-top:1px solid black"
            class="text-dark rounded-borders q-mb-md"
          >
            <q-carousel-slide
              v-if="product.selected.imagem != null"
              :style="'background-image: url('+product.selected.imagem+');background-size:contain;background-repeat:no-repeat;'"
              name="0"
              class="column no-wrap flex-center"
            />
          </q-carousel>
          <div class="text-h5 text-bold">
            {{ product.selected.nome }}
          </div>
          <q-item-label style="font-size: 16px" class="text-bold q-mt-sm">
            VARIANTES
          </q-item-label>
          <section class="flex q-mt-sm">
            <q-btn @click="selectVariant(index,product,'original')" class="flex justify-center items-center" square
                   outline>P
            </q-btn>
            <q-btn
              v-for="produto_variante in product.produto_variantes"
              class="flex justify-center items-center q-pa-md q-px-md"
              :style="'background-color:'+produto_variante.color+''"
              :color="produto_variante.color"
              @click="selectVariant(index,produto_variante,'variant')"
              square
              flat
            >
            </q-btn>
          </section>
          <q-item-label style="font-size: 16px" class="text-bold q-mt-sm">
            VALOR
          </q-item-label>
          <div style="font-size: 25px">
            {{ StringUtils.currencyBrl(product.selected.preco) }}
          </div>
          <q-btn :disable="!product.active" @click="adicionarAoCarrinho(product)" color="dark" icon="add_shopping_cart"
                 class="full-width q-py-md q-mt-md" outline>
            <template v-slot:default>
              <div class="text-dark q-ml-sm" style="font-size: 20px">
                ADICIONAR AO CARRINHO
              </div>
            </template>
          </q-btn>
          <q-btn @click="() => router.push('/produtos/'+product.id)" color="primary" icon="edit" class="full-width q-py-md q-mt-md" outline>
            <template v-slot:default>
              <div class="q-ml-sm" style="font-size: 20px">
                EDITAR PRODUTO
              </div>
            </template>
          </q-btn>
        </q-card-section>
      </q-card>
    </section>

    <!--  Dialog de Criar/Editar Produto  -->
    <q-dialog full-width v-model="modal">
      <q-card class="full-width q-pa-xl">
        <q-form @submit="submit">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">
              Criar Produto
            </div>
            <q-space/>
            <q-btn icon="close" outline round dense v-close-popup/>
          </q-card-section>
          <q-card-section class="q-gutter-y-sm">
            <section class="q-mb-md flex items-center q-gutter-x-md">
              <q-card bordered v-for="file in files" class="flex justify-center items-center shadow-0"
                      style="width: 300px">
                <div class="flex justify-center items-center"
                     :style="'background-image: url('+file.objectImage+');background-repeat:no-repeat;background-size: contain; width:200px;height:100px'">
                </div>
                <div class="flex col items-center q-py-sm justify-center">
                  <q-btn @click="deleteFile" class="self-end" icon="delete" flat color="red" size="40px"/>
                </div>
              </q-card>
              <q-file
                v-model="form.image"
                id="product-image"
                label="IMAGEM"
                :rules="[
                  ValidatorsForm.requiredFile
                ]"
                v-if="files.length <= 0"
                outlined
                @update:model-value="updateImageProduct($event)"
              >
                <template v-slot:prepend>
                  <q-icon v-if="form.image == null" class="full-height full-width" name="add" color="dark" size="30px"/>
                </template>
              </q-file>
            </section>
            <q-input
              outlined
              v-model="form.nome"
              :rules="[
                  ValidatorsForm.required
                ]"
              label="Nome do Produto"
            >
              <template v-slot:prepend>
                <q-icon name="inventory_2"/>
              </template>
            </q-input>
            <q-input
              outlined
              v-model="form.preco"
              v-money="StringUtils.currencyBrlConfig()"
              :rules="[
                  ValidatorsForm.required
                ]"
              label="Preço"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money"/>
              </template>
            </q-input>
            <q-input
              outlined
              :rules="[
                  ValidatorsForm.required
                ]"
              v-model="form.estoque"
              label="Estoque"
            >
              <template v-slot:prepend>
                <q-icon name="inventory_2"/>
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <header class="flex q-gutter-md items-center">
              <div class="text-h5 text-bold">
                Adicionar Variantes
              </div>
              <q-btn @click="adicionarVariante" size="13px" icon="add" color="green-10" round outline/>
            </header>
          </q-card-section>
          <q-card-section class="q-gutter-y-md">
            <section v-for="(variant,index) in form.variante" class="flex items-center q-gutter-x-md">
              <div v-if="variant?.image?.objectImage" style="border:1px solid grey">
                <q-img width="100px" :src="variant?.image?.objectImage">
                </q-img>
                <q-btn @click="deletarImagemVariante(index)" dense size="20px" flat color="red" icon="delete"/>
              </div>
              <q-file
                v-model="fileTempVariante"
                id="product-image"
                label="IMAGEM"
                :rules="[
                  ValidatorsForm.requiredFile
                ]"
                @update:model-value="adicionarImagemVariante(index, $event)"
                v-if="variant.image == null"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon v-if="fileTemp == null" class="full-height full-width" name="add" color="dark" size="30px"/>
                </template>
              </q-file>
              <q-input
                outlined
                v-model="variant.nome"
                readonly
                class="col-12 col-sm-12 col-md"
                label="Cor da Variante"
                :rules="[
                  ValidatorsForm.required
                ]"
              >
                <q-menu>
                  <q-color v-model="variant.nome" class="my-picker"/>
                </q-menu>
                <template v-slot:prepend>
                  <div :style="'background-color:'+variant.nome+';width:40px;height:40px;border-radius:20px'">
                  </div>
                </template>
              </q-input>
              <q-input
                outlined
                :rules="[
                  ValidatorsForm.required
                ]"
                v-model="variant.preco"
                v-money="StringUtils.currencyBrlConfig()"
                class="col-12 col-sm-12 col-md"
                label="Preço"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_money"/>
                </template>
              </q-input>
              <q-input
                v-model="variant.estoque"
                outlined
                :rules="[
                  ValidatorsForm.required
                ]"
                class="col-12 col-sm-12 col-md"
                label="Estoque"
              >
                <template v-slot:prepend>
                  <q-icon name="inventory_2"/>
                </template>
                <template v-slot:after>
                  <q-btn
                    @click="form.variante.splice(index,1)"
                    icon="delete"
                    flat
                    color="red"
                    size="20px"
                  />
                </template>
              </q-input>
            </section>
          </q-card-section>
          <q-card-actions>
            <q-btn
              type="submit"
              class="full-width q-py-md"
              color="blue-10"
              outline
              label="CRIAR PRODUTO"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {defineComponent, onMounted, ref, watch} from 'vue';
import Produto from "src/api/Produto.ts";
import StringUtils from "../constants/StringUtils.js";
import {CarrinhoStore} from "stores/CarrinhoStore.js";
import {useQuasar} from "quasar";
import {ValidatorsForm} from "src/constants/ValidatorsForm.js";
import router from "src/router/index.js";
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'IndexPage',
  methods: {router},
  computed: {
    ValidatorsForm() {
      return ValidatorsForm
    },
    StringUtils() {
      return StringUtils
    }
  },
  data() {
    return {
      slide: '0'
    }
  },
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const carrinho = CarrinhoStore();
    const listaProduto = ref([]);
    onMounted(async () => {
      $q.loading.show()
      try{
        const {data} = await Produto.list();
        listaProduto.value = data.map(item => {
          return {
            ...item,
            quantidadeParaCompra: 1,
            selected: {
              ...item,
              quantidadeParaCompra: 1
            }
          }
        });
      }catch (e){
        console.log(e)
      }finally {
        $q.loading.hide()
      }
    });

    const modal = ref(false);
    const tipoModal = ref('create');
    const fileTemp = ref(null);
    // Modal - Formulário
    const form = ref({
      image: null,
      nome: null,
      preco: null,
      estoque: null,
      variante: [],
    });

    // Modal - Configurar Produto Principal
    const files = ref([]);
    const deleteFile = () => {
      files.value = [];
    }
    watch(form.value.image, (newValue) => {

    })
    const updateImageProduct = (file) => {
      const object = {
        objectImage: URL.createObjectURL(file),
        file: file
      };
      files.value.push(object);
    }

    // Configurar Variantes do Produto
    const fileTempVariante = ref(null);
    const adicionarVariante = () => {
      form.value.variante.push({
        image: null,
        nome: null,
        preco: null,
        estoque: null
      })
    }
    const adicionarImagemVariante = (index, image) => {
      const objeto = form.value.variante[index];
      if (objeto) {
        objeto.image = {
          objectImage: URL.createObjectURL(image),
          file: image,
        }
      }
      fileTempVariante.value = null
    }
    const deletarImagemVariante = (index) => {
      const objeto = form.value.variante
      if (objeto) {
        URL.revokeObjectURL(objeto[index].objectImage);
        objeto[index].image = null
      }
    }

    const selectVariant = (index, payload, type) => {
      listaProduto.value[index].selected = payload;
    }

    const adicionarAoCarrinho = (produto) => {
      $q.loading.show();
      const buscarPeloIndex = carrinho.produtos.findIndex((item) => item.uuid === produto.uuid)
      if (buscarPeloIndex > -1) {
        carrinho.atualizarProdutos(buscarPeloIndex, produto);
      }
      if (buscarPeloIndex === -1) {
        produto.selected.quantidadeParaCompra = 1
        carrinho.adicionarProdutos(produto);
      }

      setTimeout(() => {
        $q.loading.hide();
      }, 1000);

      setTimeout(() => {
        $q.notify({
          message: 'Produto adicionado ao carrinho',
          color: 'positive',
          position: 'center',
          icon: 'done'
        })
      }, 1200)
    }

    const submit = () => {
      $q.loading.show()
      const data = form.value
      const formData = new FormData()
      formData.append('imagem', data.image)
      formData.append('nome', data.nome)
      formData.append('preco', StringUtils.unmaskCurrency(data.preco))
      formData.append('qtd', data.estoque)
      data?.variante?.forEach((item, index) => {
        console.log(item);
        formData.append(`variantes[${index}][imagem]`, item.image.file)
        formData.append(`variantes[${index}][nome]`, item.nome)
        formData.append(`variantes[${index}][preco]`, StringUtils.unmaskCurrency(item.preco))
        formData.append(`variantes[${index}][qtd]`, item.estoque)
      })
      Produto.create(formData).then((response) => {
        setTimeout(() => {
          $q.notify({
            type: 'positive',
            message: 'Produto criado realizado com sucesso'
          })
        }, 1300)
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        setTimeout(() => {
          $q.loading.hide()
        }, 1000)
      })
    }

    return {
      tipoModal,
      modal,
      fileTemp,
      files,
      deleteFile,
      fileTempVariante,
      adicionarImagemVariante,
      adicionarVariante,
      deletarImagemVariante,
      form,
      listaProduto,
      selectVariant,
      adicionarAoCarrinho,
      submit,
      updateImageProduct,
      router
    }
  }
});
</script>

<style>
.test {
  background-size: contain;
}
</style>
