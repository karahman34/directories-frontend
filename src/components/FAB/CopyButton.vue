<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        color="indigo"
        v-bind="attrs"
        v-on="on"
        @click="$emit('copy')"
      >
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
    </template>

    <span>Copy</span>
  </v-tooltip>
</template>
