<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script>
import AuthLayout from '@/layouts/auth/Layout'
import DashboardLayout from '@/layouts/dashboard/Layout'
import BlankLayout from '@/layouts/blank/Layout'
import PublicLayout from '@/layouts/public/Layout'
import { setWindowTitle } from '@/helpers/app'

export default {
  name: 'App',

  components: {
    AuthLayout,
    BlankLayout,
    DashboardLayout,
    PublicLayout,
  },

  computed: {
    layout() {
      const defaultLayout = 'auth-layout'
      const routeLayout = this.$route.meta?.layout

      return routeLayout ? `${routeLayout}-layout` : defaultLayout
    },
  },

  watch: {
    $route: {
      immediate: true,
      handler() {
        const routeTitle = this.$route.meta?.title

        setWindowTitle(routeTitle)
      },
    },
  },
}
</script>
