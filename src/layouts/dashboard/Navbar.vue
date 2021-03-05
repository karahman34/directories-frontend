<template>
  <v-app-bar app dark flat color="blue-grey darken-4">
    <!-- Nav Hamburber -->
    <v-app-bar-nav-icon @click="$emit('toggle-sidebar')"></v-app-bar-nav-icon>

    <!-- Search Box -->
    <v-text-field
      v-model="search"
      dark
      solo
      dense
      clearable
      hide-details
      class="search-box"
      placeholder="Search.."
      background-color="blue-grey darken-3"
      prepend-inner-icon="mdi-magnify"
      @click:clear="search = null"
    ></v-text-field>

    <!-- Spacer -->
    <v-spacer></v-spacer>

    <!-- User Dropdown -->
    <user-dropdown></user-dropdown>
  </v-app-bar>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import UserDropdown from './components/UserDropdown'

export default {
  components: {
    UserDropdown,
  },

  data: () => ({
    search: '',
    searchTimeout: null,
  }),

  computed: {
    ...mapState('storage', {
      searchState: state => state.search,
    }),
  },

  watch: {
    search(val) {
      clearTimeout(this.searchTimeout)

      this.searchTimeout = setTimeout(() => {
        this.setSearch(val)

        if (this.$route.name !== 'Drive') {
          this.$router.push({
            name: 'Drive',
          })
        }
      }, 350)
    },
    searchState(val) {
      if (val !== this.search) {
        this.search = val
      }
    },
  },

  methods: {
    ...mapMutations('storage', {
      setSearch: 'SET_SEARCH',
    }),
  },
}
</script>

<style scoped>
.search-box {
  max-width: 300px;
}
</style>
