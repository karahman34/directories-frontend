<template>
  <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
    <v-img :src="src"></v-img>
  </v-dialog>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    src: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      dialog: true,
    }
  },

  watch: {
    dialog(dialog) {
      if (this.value !== dialog) {
        this.emitChangeEvent(dialog)
      }
    },
    value: {
      immediate: true,
      handler(value) {
        this.dialog = value
      },
    },
  },

  methods: {
    emitChangeEvent(value) {
      this.$emit('change', value)
    },
  },
}
</script>
