<template>
  <v-app v-if="loggedIn" id="dashboard-layout">
    <!-- The Sidebar -->
    <sidebar
      :menus="menus"
      :value="sidebar"
      @change="sidebar = $event || false"
    ></sidebar>

    <!-- The Navbar -->
    <navbar class="d-lg-none" @toggle-sidebar="sidebar = !sidebar"></navbar>

    <!-- The Overlay -->
    <overlay></overlay>

    <!-- The Snackbar -->
    <snackbar></snackbar>

    <v-main id="main-section" class="pt-lg-0 grey lighten-3 primary--text">
      <v-container class="px-lg-6 py-1 mx-0">
        <!-- Navbar Desktop -->
        <navbar-desktop class="d-none d-lg-block"></navbar-desktop>

        <!-- Route Name -->
        <div class="my-2 mt-lg-0 mb-lg-3 d-flex align-center">
          <v-icon class="text-h5 mr-2 blue-grey--text text--darken-3">{{
            currentRoute.icon
          }}</v-icon>
          <span class="text-h5 blue-grey--text text--darken-3">{{
            currentRoute.text
          }}</span>
        </div>

        <!-- Router View -->
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from './Navbar'
import NavbarDesktop from './NavbarDesktop'
import Sidebar from './Sidebar'
import Snackbar from '@/components/Snackbar'
import Overlay from '@/components/Overlay'

export default {
  components: {
    Navbar,
    NavbarDesktop,
    Sidebar,
    Snackbar,
    Overlay,
  },

  data() {
    return {
      sidebar: false,
    }
  },

  computed: {
    ...mapState({
      menus: 'menus',
    }),
    ...mapState('auth', {
      loggedIn: 'loggedIn',
    }),
    currentRoute() {
      return this.menus.find(menu => menu.to.name === this.$route.name)
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/dashboardLayout.scss';
</style>
