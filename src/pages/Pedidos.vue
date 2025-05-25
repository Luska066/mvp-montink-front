<script>
import {onMounted, ref} from "vue";
import Pedidos from "src/api/Pedidos.js";
import StringUtils from "src/constants/StringUtils.js";
import moment from "moment";

export default {
  name: "Pedidos",
  computed: {
    StringUtils() {
      return StringUtils
    }
  },
  setup() {
    const modal = ref(false);
    const payload = ref(null);
    const openModal = (pedido) => {
      modal.value = true;
      payload.value = pedido;
    }

    const rows = ref([])
    onMounted(async () => {
      const {data} = await Pedidos.list()
      rows.value = data;
    })
    const columns = [
      {name: 'id', align: 'left', label: 'Id', field: 'uuid', sortable: true},
      {
        name: 'total',
        align: 'left',
        label: 'Total',
        field: 'total',
        format: (value) => StringUtils.currencyBrl(value),
        sortable: true
      },
      {
        name: 'frete',
        align: 'left',
        label: 'Frete',
        field: 'frete',
        format: (value) => StringUtils.currencyBrl(value),
        sortable: true
      },
      {
        name: 'desconto',
        align: 'left',
        label: 'Desconto',
        format: (value) => StringUtils.currencyBrl(value),
        field: 'desconto',
        sortable: true
      },
      {
        name: 'created_at',
        align: 'left',
        label: 'Data de Criação',
        format: (value) => moment.utc(value).format('DD/MM/YYYY HH:mm:ss'),
        field: 'created_at',
        sortable: true
      },
      {name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true},
      {name: 'actions', align: 'left', label: 'Ações', sortable: true},
    ];

    const cancelar = async (id) => {
      await Pedidos.cancel(id);
      window.location.reload();
    }

    const aprovar = async (id) => {
      await Pedidos.approve(id);
      window.location.reload();
    }

    return {
      columns,
      rows,
      openModal,
      modal,
      payload,
      cancelar,
      aprovar
    }
  }
}
</script>

<template>
  <q-table
    title="Pedidos"
    :rows="rows"
    :columns="columns"
    row-key="name"
  >
    <template v-slot:body-cell-actions="props">
      <q-td>
        <q-btn flat icon="visibility" color="primary" @click="openModal(props.row)">
          <q-tooltip>
            Visualizar
          </q-tooltip>
        </q-btn>
        <q-btn @click="cancelar(props.row.id)"  flat icon="block" color="red">
          <q-tooltip>
            Cancelar
          </q-tooltip>
        </q-btn>
        <q-btn @click="aprovar(props.row.id)" flat icon="check" color="green-10">
          <q-tooltip>
            Finalizar
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
  <q-dialog full-width v-model="modal">
    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">Detalhes do pedido</div>
        <section>
          <q-item-label style="border:1px solid grey" class="q-pa-sm rounded-borders">
            <div class="text-bold">
              Id: {{ payload.uuid }}
            </div>
          </q-item-label>
          <q-item-label style="border:1px solid grey" class="q-pa-sm rounded-borders">
            <div class="text-bold">
              Total: {{ StringUtils.currencyBrl(payload.total) }}
            </div>
          </q-item-label>
          <q-item-label style="border:1px solid grey" class="q-pa-sm rounded-borders">
            <div class="text-bold">
              Frete: {{ StringUtils.currencyBrl(payload.frete) }}
            </div>
          </q-item-label>
          <q-item-label style="border:1px solid grey" class="q-pa-sm rounded-borders">
            <div class="text-bold">
              Desconto: {{ StringUtils.currencyBrl(payload.desconto) }}
            </div>
          </q-item-label>
          <q-item-label style="border:1px solid grey" class="q-pa-sm rounded-borders">
            <div class="text-bold">
              Email: {{ payload?.email || "N/A"}}
            </div>
          </q-item-label>
          <section class="flex items-center q-mt-sm q-gutter-x-sm">
            <div style="border:1px solid grey" class="col q-pa-sm rounded-borders text-bold">
                Cep: {{ payload?.cep || "N/A"}}
            </div>
            <div style="border:1px solid grey" class="q-pa-sm col rounded-borders text-bold">
                Estado: {{ payload?.estado ?? "N/A"}}
            </div>
            <div style="border:1px solid grey" class="q-pa-sm col rounded-borders text-bold">
                Cidade: {{ payload?.cidade ?? "N/A"}}
            </div>
          </section>
          <section class="flex items-center q-py-sm q-gutter-x-sm">
            <div style="border:1px solid grey" class="q-pa-sm text-bold  col rounded-borders">
                Número: {{ payload?.numero ?? "N/A"}}
            </div>
            <div style="border:1px solid grey" class="q-pa-sm col rounded-borders text-bold">
                Complemento: {{ payload?.complemento ?? "N/A"}}
            </div>
            <div style="border:1px solid grey" class="q-pa-sm col rounded-borders text-bold">
                Rua: {{ payload?.rua ?? "N/A"}}
            </div>
          </section>
        </section>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <div class="text-h6">Produtos</div>
        <q-table
          class="shadow-0"
          :rows="payload.pedidos_items"
          :columns="[
                  {
                    name: 'imagem',
                    align: 'left',
                    label: 'Imagem do Produto',
                    sortable: true
                  },
                  {
                    name: 'id',
                    align: 'left',
                    label: 'Id',
                    field: row => row.produto.uuid,
                    sortable: true
                  },
                  {
                    name: 'preco',
                    align: 'left',
                    label: 'Preço',
                    field: row => row.preco,
                    // format: (value) => StringUtils.currencyBrl(value),
                    sortable: true
                  },
                  {
                    name: 'qtd',
                    align: 'left',
                    label: 'Quantidade',
                    field: row => row.qtd,
                    // format: (value) => StringUtils.currencyBrl(value),
                    sortable: true
                  },
            ]"
          row-key="name"
        >
          <template v-slot:body-cell-imagem="props">
            <q-td>
              <q-img width="200px" :src="props.row.produto_variante_id != null ? props.row.produto_variante.imagem : props.row.produto.imagem"/>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
