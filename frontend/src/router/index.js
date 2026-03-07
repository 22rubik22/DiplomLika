import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue')
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/ProductView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrdersView.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('@/views/CollectionsView.vue')
    },
    {
      path: '/new-editions',
      name: 'new-editions',
      component: () => import('@/views/NewEditionsView.vue')
    },
    {
      path: '/rare-books',
      name: 'rare-books',
      component: () => import('@/views/RareBooksView.vue')
    },
    {
      path: '/bookcrossing',
      name: 'bookcrossing',
      component: () => import('@/views/BookcrossingView.vue')
    },
    {
      path: '/author-meetings',
      name: 'author-meetings',
      component: () => import('@/views/AuthorMeetingsView.vue')
    },
    {
      path: '/delivery-payment',
      name: 'delivery-payment',
      component: () => import('@/views/DeliveryPaymentView.vue')
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('@/views/ContactsView.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/FAQView.vue')
    },
    {
      path: '/sitemap',
      name: 'sitemap',
      component: () => import('@/views/SitemapView.vue')
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: () => import('@/views/TrackingView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminView.vue'),
      meta: { requiresAuth: true, isAdmin: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router