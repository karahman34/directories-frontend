<template>
  <div class="logo d-flex align-center">
    <v-icon class="mr-2 logo-icon">mdi-folder-text-outline</v-icon>
    <span>{{ appTitle }}</span>
  </div>
</template>

<script>
export default {
  computed: {
    appTitle() {
      return process.env.VUE_APP_TITLE
    },
  },
}
</script>

<style lang="scss" scoped>
.logo {
  .logo-icon {
    color: inherit !important;
    font-size: inherit !important;
  }
}
</style>
