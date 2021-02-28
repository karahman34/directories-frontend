import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      middleware: 'auth',
    },
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      middleware: 'guest',
    },
    component: () => import('@/views/Login.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
