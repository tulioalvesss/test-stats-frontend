import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ConfiguracoesView from '../views/ConfiguracoesView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/configuracoes',
    name: 'configuracoes',
    component: ConfiguracoesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // A rota requer autenticação
    if (!isAuthenticated) {
      // Redirecionar para a página de login se não estiver autenticado
      next({ name: 'login' })
    } else {
      // Prosseguir para a rota se estiver autenticado
      next()
    }
  } else {
    // Se estiver autenticado e tentando acessar a página de login, redirecionar para o dashboard
    if (isAuthenticated && to.name === 'login') {
      next({ name: 'dashboard' })
    } else {
      // Caso contrário, prosseguir normalmente
      next()
    }
  }
})

export default router 