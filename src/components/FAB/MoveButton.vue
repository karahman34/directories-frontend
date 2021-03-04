<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        color="orange darken-1"
        v-bind="attrs"
        v-on="on"
        @click="$emit('move')"
      >
        <v-icon>mdi-file-move</v-icon>
      </v-btn>
    </template>

    <span>Move</span>
  </v-tooltip>
</template>
