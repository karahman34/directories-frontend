<template>
  <v-card flat>
    <v-card-title>
      Overall Usage
    </v-card-title>

    <v-card-text class="d-flex align-center">
      <v-progress-circular :size="100" :width="6" :value="95" color="teal">
        <v-icon class="text-h3">mdi-cloud-outline</v-icon>
      </v-progress-circular>

      <div class="d-flex flex-column ml-3 text-subtitle-1">
        <span class="text-h5">{{ usedSpaceInPercent }}%</span>
        <span>{{ usedSpaceInGb }} GB</span>
        <span>of {{ spaceInGb }} GB</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { byteToGb, formatStorageSpace } from '@/helpers/storage'

export default {
  props: {
    space: {
      type: Number,
      required: true,
    },
    usedSpace: {
      type: Number,
      required: true,
    },
  },

  computed: {
    spaceInGb() {
      return byteToGb(this.space)
    },
    usedSpaceInGb() {
      return formatStorageSpace(byteToGb(this.usedSpace))
    },
    usedSpaceInPercent() {
      return Math.floor((this.usedSpace / this.space) * 100)
    },
  },
}
</script>
