<template>
  <div id="error-page">
    <div class="mb-3">
      <span class="mr-3 text-h4">{{ errorCode }}</span>
      <span class="text-h4">{{ msg }}</span>
    </div>

    <v-btn text :to="{ name: 'Dashboard' }">
      <v-icon>mdi-campfire</v-icon>
      <span>Go back home</span>
    </v-btn>
  </div>
</template>

<script>
export default {
  computed: {
    errorCode() {
      return this.$route.params?.code || 404
    },
    msg() {
      switch (parseInt(this.errorCode)) {
        case 403:
          return 'Forbidden.'

        case 500:
          return 'Server error.'

        default:
          return 'Page not found.'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#error-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
