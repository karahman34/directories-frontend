<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        color="blue darken-2"
        v-bind="attrs"
        v-on="on"
        @click="$emit('cancel')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>

    <span class="text-capitalize">Cancel {{ action }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      required: true,
    },
  },
}
</script>
