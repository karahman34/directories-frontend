<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script>
import AuthLayout from '@/layouts/auth/Layout'
import DashboardLayout from '@/layouts/dashboard/Layout'

export default {
  name: 'App',

  components: {
    AuthLayout,
    DashboardLayout,
  },

  computed: {
    layout() {
      const defaultLayout = 'auth-layout'
      const routeLayout = this.$route.meta?.layout

      return routeLayout ? `${routeLayout}-layout` : defaultLayout
    },
  },
}
</script>
