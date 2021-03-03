<template>
  <v-app id="auth-layout">
    <v-main id="main" class="blue-grey darken-4">
      <v-container>
        <!-- Router View -->
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import '@/assets/authLayout.scss';
</style>
