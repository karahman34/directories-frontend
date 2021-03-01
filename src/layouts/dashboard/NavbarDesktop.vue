<template>
  <v-app-bar flat color="transparent" class="navbar-desktop">
    <!-- Greet -->
    <div class="text-h4">Hi, {{ firstName }}</div>

    <!-- Spacer -->
    <v-spacer></v-spacer>

    <!-- Search -->
    <search-box class="mr-3"></search-box>

    <!-- User Dropdown -->
    <user-dropdown></user-dropdown>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
import UserDropdown from '@/layouts/dashboard/components/UserDropdown'
import SearchBox from '@/components/SearchBox'

export default {
  components: {
    UserDropdown,
    SearchBox,
  },

  computed: {
    ...mapState('auth', {
      user: state => state.user,
    }),
    firstName() {
      return this.user.name.split(' ')[0]
    },
  },
}
</script>

<style lang="scss">
.navbar-desktop {
  position: sticky;
  top: 0;

  .v-toolbar__content {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }
}
</style>
