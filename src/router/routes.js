const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name:'initial',path: '', component: () => import('pages/IndexPage.vue') },
      { name:'carrinho',path: '/carrinho', component: () => import('pages/Carrinho.vue') },
      { name:'pedidos',path: '/pedidos', component: () => import('pages/Pedidos.vue') },
      { name:'pedidos-edit',path: '/produtos/:id', component: () => import('pages/EditarProduto.vue') },
      { name:'cupons',path: '/cupons', component: () => import('pages/Coupons.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
