<script>
import moment from "moment";
import {onMounted, ref} from "vue";
import {ValidatorsForm} from "src/constants/ValidatorsForm.js";
import StringUtils from "src/constants/StringUtils.js";
import Cupom from "src/api/Cupom.js";
import {useQuasar} from "quasar";

export default {
  name: "Coupons",
  computed: {
    StringUtils() {
      return StringUtils
    },
    ValidatorsForm() {
      return ValidatorsForm
    },
    moment() {
      return moment
    }
  },
  setup() {
    const $q = useQuasar();
    const cupons = ref([]);
    const model = ref(false)
    const form = ref({
      code: '',
      date: '',
      valor: 0,
      valor_minimo: '',
    })
    onMounted(async () => {
      const {data} = await Cupom.list();
      cupons.value = data
    })
    const submit = () => {
      $q.loading.show();
      const data = {
        'code': form.value.code,
        'discount_percent': String(form.value.valor),
        'min_cart_value': String(StringUtils.unmaskCurrency(form.value.valor_minimo)),
        'valid_from' : form.value.date.from,
        'valid_until': form.value.date.to,
      }
      Cupom.create(data).then(response => {
        $q.loading.hide();
        $q.notify({
          type: 'positive',
          message: "Produto Criado com sucesso"
        })
        setTimeout(() => {
          window.location.reload();
        },1000)
      }).catch(error => {
        $q.notify({
          type: 'negative',
          message: error.response.data.message
        })
      }).finally(() => {
        setTimeout(() => {
          $q.loading.hide();
        },1500)
      })
    }

    const deleteCupom = (id) => {
      $q.loading.show();
      Cupom.delete(id).then(response => {
        $q.loading.hide();
        $q.notify({
          type: 'positive',
          message: "Produto Deletado com sucesso"
        })
        setTimeout(() => {
          window.location.reload();
        },1000)
      }).catch(error => {
        $q.notify({
          type: 'negative',
          message: error.response.data.message
        })
      }).finally(() => {
        setTimeout(() => {
          $q.loading.hide();
        },1500)
      })
    }

    return {
      model,
      form,
      submit,
      deleteCupom,
      cupons
    }
  }
}
</script>

<template>
  <q-page>
    <header class="flex q-gutter-x-md bg-dark text-white q-pa-md">
      <div class="text-h4 text-bold ">CUPONS</div>
      <q-input
        placeholder="FUNCIONALIDADE IMCOMPLETA"
        class="col" bg-color="white" color="white" outlined dense>
        <template v-slot:prepend>
          <q-icon color="dark" size="20px" name="search"/>
        </template>
      </q-input>
      <q-btn color="white" @click="() => model = true" label="CRIAR CUPOM" outline icon="add">
      </q-btn>
    </header>
    <section class="flex items-center q-gutter-md q-pa-md">
      <q-card v-for="item  in cupons" class="shadow-0" bordered style="max-width: 380px">
        <q-card-section class="column">
          <header class="self-end">
            <q-btn @click="deleteCupom(item.id)" outline rounded round icon="delete"  dense color="red"/>
          </header>
          <div class="flex justify-start items-center">
            <section>
              <div class="flex items-center">
                <q-icon size="40px" name="description"/>
                <div class="text-h4 text-bold">{{item.code}}</div>
              </div>
              <div class="q-mt-sm q-ml-sm">
                <q-item-label>VALOR MÍNIMO : {{ StringUtils.currencyBrl(item.min_cart_value) }}</q-item-label>
                <q-item-label>INÍCIO : {{ moment.utc(item.valid_from).format('DD/MM/YYYY') }}</q-item-label>
                <q-item-label>FIM : {{ moment.utc(item.valid_until).format('DD/MM/YYYY') }}</q-item-label>
              </div>
            </section>
            <section class="q-mt-lg">
              <div class="text-bold text-red-10 text-h2">{{item.discount_percent}}%</div>
            </section>
          </div>
        </q-card-section>
      </q-card>
    </section>
    <q-dialog v-model="model">
      <q-card style="width: 400px;">
        <q-form @submit="submit">
          <q-card-section>
            <div class="text-h4 text-bold">Criar Cupom</div>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <q-input outlined v-model="form.code" :rules="[ValidatorsForm.required]"
                     label="CODE">
              <template v-slot:prepend>
                <q-icon name="password"/>
              </template>
            </q-input>
            <q-input
              outlined
              label="Data" readonly
              :model-value="moment.utc(form.date.from).format('DD/MM/YYYY')+' - '+moment.utc(form.date.to).format('DD/MM/YYYY')"
              :rules="[ValidatorsForm.required]"
            >
              <q-menu>
                <q-date v-model="form.date" range/>
              </q-menu>
              <template v-slot:prepend>
                <q-icon name="event"/>
              </template>
            </q-input>
            <q-input
              outlined
              type="number"
              v-model.number="form.valor"
              label="Valor (%)"
              :rules="[ValidatorsForm.requiredNumber]"
            >
              <template v-slot:prepend>
                %
              </template>
            </q-input>
            <q-input
              outlined
              v-model="form.valor_minimo"
              v-money="StringUtils.currencyBrlConfig()"
              label="Valor Mínimo (R$)"
              :rules="[ValidatorsForm.required]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money"/>
              </template>
            </q-input>
          </q-card-section>
          <q-card-actions>
            <q-btn type="submit" label="CRIAR" color="green-10" class="full-width"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>

</style>
