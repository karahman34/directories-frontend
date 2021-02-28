<template>
  <div class="d-flex align-center">
    <v-icon class="mr-2" :class="[color, textSize]"
      >mdi-folder-text-outline</v-icon
    >
    <span :class="[color, textSize]">Archiver</span>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'h5',
    },
    color: {
      type: String,
      default: 'text--primary',
    },
  },

  computed: {
    textSize() {
      return `text-${this.size}`
    },
  },
}
</script>
