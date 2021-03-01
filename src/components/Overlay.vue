<template>
  <v-overlay :value="overlay.show" class="text-center">
    <v-progress-circular
      indeterminate
      :size="64"
      class="white--text"
    ></v-progress-circular>

    <p class="mt-5">{{ overlay.text }}</p>
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
