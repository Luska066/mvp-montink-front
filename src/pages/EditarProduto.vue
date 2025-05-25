<script>
import {ValidatorsForm} from "src/constants/ValidatorsForm.js";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import Produto from "src/api/Produto.js";
import {useQuasar} from "quasar";
import StringUtils from "src/constants/StringUtils.js";

export default {
  name: "EditarProduto",
  computed: {
    StringUtils() {
      return StringUtils
    },
    ValidatorsForm() {
      return ValidatorsForm
    }
  },
  setup() {
    const $q = useQuasar();
    const router = useRoute();
    const formImage = ref(null);
    const form = ref({
      ativo: true,
      image: null,
      nome: null,
      preco: '',
      estoque: '',
      variante: [],
    });
    onMounted(async () => {
      reset()
      const {data} = await Produto.show(router.params.id)
      formImage.value = data.imagem;
      form.value.nome = data.nome;
      form.value.preco = data.preco.toFixed(2);
      form.value.ativo = data.active;
      form.value.estoque = String(data.estoque);
      console.log(data)
      form.value.variante = data?.produto_variantes?.map(item => {
        return {
          image: {
            url: item.imagem,
            objectImage: null,
          },
          id: item.id,
          nome: item.color,
          preco: item.preco.toFixed(2),
          estoque: String(item.estoque)
        }
      }) ?? []
    });
    const updateImage = (image) => {
      form.value.image = image;
      formImage.value = URL.createObjectURL(image);
    }

    const reset = () => {
      formImage.value = null;
      form.value = {
        ativo: true,
        image: null,
        nome: null,
        preco: '',
        estoque: '',
        variante: [],
      }
    }

    const submit = () => {
      $q.loading.show()
      const data = form.value
      const formData = new FormData()
      if(data.image != null){
        formData.append('imagem', data.image)
      }
      formData.append('_method', 'PUT')
      formData.append('nome', data.nome)
      formData.append('active', data.ativo ? 1 : 0)
      formData.append('preco', StringUtils.unmaskCurrency(data.preco))
      formData.append('qtd', data.estoque)
      data?.variante?.forEach((item, index) => {
        console.log(item);
        formData.append(`variantes[${index}][id]`, item.id)
        formData.append(`variantes[${index}][imagem]`, item?.image?.objectImage ?? null)
        formData.append(`variantes[${index}][nome]`, item.nome)
        formData.append(`variantes[${index}][preco]`, StringUtils.unmaskCurrency(item.preco))
        formData.append(`variantes[${index}][qtd]`, item.estoque)
      });
      Produto.update(router.params.id, formData)
        .then(() => {
          setTimeout(() => {
            $q.notify({
              type: 'positive',
              message: 'Produto criado realizado com sucesso'
            })
          }, 1300)
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          setTimeout(() => {
            $q.loading.hide()
          }, 1000)
        });
    }

    return {
      form,
      formImage,
      updateImage,
      submit
    }
  }
}
</script>

<template>
  <q-card class="full-width q-pa-md shadow-0">
    <q-form @submit="submit">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          Editar Produto
        </div>
        <q-toggle
          v-model="form.ativo"
          :left-label="true"
          class="q-ml-lg"
          label="Ativar Produto"
          color="green"
        />
      </q-card-section>
      <q-card-section class="q-gutter-y-sm">
        <q-img v-if="formImage" :src="formImage" width="150px"/>
        <q-file
          v-model="form.image"
          id="product-image"
          class="col q-mt-md"
          style="width: 100%"
          label="IMAGEM"
          outlined
          @update:model-value="updateImage($event)"
        >
          <template v-slot:prepend>
            <q-icon class="full-height full-width" name="add" color="dark" size="30px"/>
          </template>
        </q-file>
        <q-input
          v-model="form.nome"
          outlined
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
          v-model="form.estoque"
          outlined
          :rules="[
            ValidatorsForm.required
          ]"
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
          <q-btn size="13px" icon="add" color="green-10" round outline/>
        </header>
      </q-card-section>
      <q-card-section class="q-gutter-y-md">
        <section v-for="(variant,index) in form.variante" class="flex items-center q-gutter-x-md">
          <q-file
            v-model="variant.image.objectImage"
            id="product-image"
            class="q-mb-md col"
            style="margin-bottom:20px"
            :rules="[]"
            label="IMAGEM"
            outlined
          >
            <template v-slot:before>
              <q-img v-if="variant?.image.url" width="100px" :src="variant?.image.url">
              </q-img>
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
            v-money="StringUtils.currencyBrlConfig()"
            :rules="[
                  ValidatorsForm.required
                ]"
            v-model="variant.preco"
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
          label="SALVAR ALTERAÇÕES"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<style scoped>

</style>
