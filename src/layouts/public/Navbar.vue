<template>
  <v-app-bar app class="elevation-0">
    <v-app-bar-title>
      <router-link class=" text-decoration-none" :to="{ name: 'Dashboard' }">{{
        appTitle
      }}</router-link>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <template v-if="!loggedInState">
      <v-btn text class="mr-4" :to="{ name: 'Register' }">Register</v-btn>
      <v-btn color="primary" :to="{ name: 'Login' }">Login</v-btn>
    </template>

    <template v-else>
      <user-dropdown use-name></user-dropdown>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
import UserDropdown from '@/layouts/dashboard/components/UserDropdown'

export default {
  components: {
    UserDropdown,
  },

  computed: {
    ...mapState('auth', {
      loggedInState: state => state.loggedIn,
      userState: state => state.user,
    }),
    appTitle() {
      return process.env.VUE_APP_TITLE
    },
  },
}
</script>
