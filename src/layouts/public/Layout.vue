<template>
  <v-app id="public-layout">
    <!-- Navbar -->
    <navbar></navbar>

    <!-- The Overlay -->
    <overlay></overlay>

    <!-- Main -->
    <v-main class="mt-4 grey lighten-3 primary--text">
      <v-container>
        <!-- Router View -->
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './Navbar'
import Overlay from '@/components/Overlay'

export default {
  components: {
    Navbar,
    Overlay,
  },
}
</script>
