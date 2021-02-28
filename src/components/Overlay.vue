<template>
  <v-overlay :value="overlay">
    <v-progress-circular
      indeterminate
      :size="64"
      class="white--text"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      overlay: 'overlay',
    }),
  },
}
</script>
