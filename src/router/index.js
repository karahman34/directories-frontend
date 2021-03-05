import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    meta: {
      layout: 'dashboard',
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
  {
    path: '/register',
    name: 'Register',
    meta: {
      middleware: 'guest',
    },
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/drive',
    name: 'Drive',
    meta: {
      layout: 'dashboard',
      middleware: 'auth',
    },
    component: () => import('@/views/Drive.vue'),
  },
  {
    path: '/trash',
    name: 'Trash',
    meta: {
      layout: 'dashboard',
      middleware: 'auth',
    },
    component: () => import('@/views/Trash.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {
      layout: 'dashboard',
      middleware: 'auth',
    },
    component: () => import('@/views/Settings.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
