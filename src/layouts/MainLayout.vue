<template>
  <q-layout view="hHh Lpr lFf">
    <q-header bordered class="bg-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="dark"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <q-img width="150px" src="../assets/logo.png"/>
        </q-toolbar-title>
        <div>
          <q-btn
            @click="() => router.push('carrinho')"
            size="20px"
            color="dark"
            flat
            dense
            icon="shopping_cart"
          >
            <q-badge floating color="red" rounded class="q-mt-sm q-mr-sm text-bold">
              {{ itemsCarrinhoTotal }}
            </q-badge>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list class="q-mt-md">
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent, ref} from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import {CarrinhoStore} from "stores/CarrinhoStore.js";
import router from "src/router/index.js";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

const linksList = [
  {
    title: 'Produtos',
    caption: 'CRUD',
    icon: 'inventory_2',
    link: 'initial'
  },
  {
    title: 'Pedidos',
    caption: 'Consulte os pedidos',
    icon: 'receipt',
    link: 'pedidos'
  },
  {
    title: 'Cupom',
    caption: 'Configure os cupons',
    icon: 'description',
    link: 'cupons'
  },
]

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  computed: {
    itemsCarrinhoTotal() {
      return CarrinhoStore().produtos.length
    }
  },
  data() {
    return {
      router: useRouter(),
      linksList,
      leftDrawerOpen: false
    }
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  setup() {
    const quasar = useQuasar();
    // const leftDrawerOpen = ref(false);
    // const miniOpen = ref(false);
    //
    // function handleDrawer() {
    //   if (quasar.screen.lt.sm) {
    //     leftDrawerOpen.value = !leftDrawerOpen.value;
    //   } else {
    //     miniOpen.value = !miniOpen.value;
    //   }
    // }

    return {
      // leftDrawerOpen,
      // miniOpen,
      // handleDrawer,

    }
  }
})
</script>
