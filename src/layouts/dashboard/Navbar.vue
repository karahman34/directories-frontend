<template>
  <v-app-bar app dark flat color="primary">
    <!-- Nav Hamburber -->
    <v-app-bar-nav-icon @click="$emit('toggle-sidebar')"></v-app-bar-nav-icon>

    <!-- Search Box -->
    <v-text-field
      v-model="search"
      dark
      solo
      dense
      hide-details
      class="search-box"
      background-color="blue-grey darken-3"
      placeholder="Search.."
      prepend-inner-icon="mdi-magnify"
      :append-icon="search.length ? 'mdi-close' : null"
      @click:append="search = ''"
    ></v-text-field>

    <!-- Spacer -->
    <v-spacer></v-spacer>

    <!-- User Dropdown -->
    <user-dropdown></user-dropdown>
  </v-app-bar>
</template>

<script>
import UserDropdown from './components/UserDropdown'

export default {
  components: {
    UserDropdown,
  },

  data: () => ({
    search: '',
  }),
}
</script>

<style scoped>
.search-box {
  max-width: 300px;
}
</style>
