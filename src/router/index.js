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
      title: 'Dashboard',
      middleware: 'auth',
    },
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Login',
      middleware: 'guest',
    },
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: 'Register',
      middleware: 'guest',
    },
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/drive',
    name: 'Drive',
    meta: {
      layout: 'dashboard',
      title: 'Drive',
      middleware: 'auth',
    },
    component: () => import('@/views/Drive.vue'),
  },
  {
    path: '/trash',
    name: 'Trash',
    meta: {
      layout: 'dashboard',
      title: 'Trash',
      middleware: 'auth',
    },
    component: () => import('@/views/Trash.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {
      layout: 'dashboard',
      title: 'Settings',
      middleware: 'auth',
    },
    component: () => import('@/views/Settings.vue'),
  },
  {
    path: '/error/:code',
    name: 'ErrorPage',
    meta: {
      layout: 'blank',
    },
    component: () => import('@/views/ErrorPage.vue'),
  },
  {
    path: '*',
    meta: {
      layout: 'blank',
    },
    component: () => import('@/views/ErrorPage.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
