<template>
  <v-menu offset-y rounded="md">
    <!-- Activator -->
    <template v-slot:activator="{ on }">
      <!-- With Name -->
      <v-btn
        text
        class="activator px-3 ml-4"
        :class="{ 'd-lg-none': !useName }"
        v-on="on"
      >
        <span>{{ firstName }}</span>
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>

      <!-- With Icon -->
      <v-btn
        rounded
        color="primary"
        class="d-none px-2 elevation-1"
        :class="{ 'd-lg-block': !useName }"
        v-on="on"
      >
        <v-icon>mdi-account</v-icon>
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <!-- Menus -->
    <v-list>
      <v-list-item @click="goLogout">
        <v-list-item-icon class="mr-2">
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    useName: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState('auth', {
      user: state => state.user,
    }),
    firstName() {
      return this.user.name.split(' ')[0]
    },
  },

  methods: {
    ...mapActions('auth', {
      logout: 'logout',
    }),
    async goLogout() {
      this.$overlay.show()

      try {
        await this.logout()

        this.$router.push({
          name: 'Login',
        })
      } catch (err) {
        this.$snackbar.show({
          text: 'Failed to logout user',
        })
      } finally {
        this.$overlay.hide()
      }
    },
  },
}
</script>

<style scoped>
.activator {
  cursor: pointer !important;
}
</style>
