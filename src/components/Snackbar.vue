<template>
  <v-snackbar
    v-model="show"
    bottom
    right
    rounded="pill"
    class="snackbar-plugin"
    :color="color || 'primary'"
  >
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn color="orange" text v-bind="attrs" @click="hideSnackbar">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    show: false,
    text: null,
    color: null,
  }),

  computed: {
    ...mapState({
      snackbar: 'snackbar',
    }),
  },

  watch: {
    snackbar: {
      deep: true,
      handler(snackbar) {
        this.text = snackbar.text
        this.color = snackbar.color

        if (this.text !== null) {
          this.show = true
        }
      },
    },
    show(show) {
      if (!show) {
        this.hideSnackbar()
      }
    },
  },

  methods: {
    hideSnackbar() {
      this.show = false
      this.$snackbar.hide()
    },
  },
}
</script>

<style lang="scss">
.snackbar-plugin.v-snack--active {
  bottom: 15px;
}
</style>
