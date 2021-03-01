<template>
  <v-card flat>
    <v-card-title>
      Used Storage
    </v-card-title>

    <v-card-text>
      <div class="d-flex justify-space-between align-center text-subtitle-1">
        <div class="d-flex align-center">
          <v-icon>mdi-cloud</v-icon>
          <span class="mx-2">{{ usedSpaceInPercent }}%</span>
          <span>Cloud</span>
        </div>

        <div>{{ usedSpaceInGb }} GB</div>
      </div>

      <div class="d-flex justify-space-between align-center text-subtitle-1">
        <div class="d-flex align-center">
          <v-icon>mdi-circle-outline</v-icon>
          <span class="mx-2">{{ availableSpaceInPercent }}%</span>
          <span>Available</span>
        </div>

        <div>{{ availableSpaceInGb }} GB</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { byteToGb } from '@/helpers/storage'

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
    usedSpaceInGb() {
      return byteToGb(this.usedSpace)
        .toString()
        .slice(0, 4)
    },
    availableSpaceInGb() {
      return byteToGb(this.space - this.usedSpace)
        .toString()
        .slice(0, 4)
    },
    usedSpaceInPercent() {
      return Math.floor((this.usedSpace / this.space) * 100)
    },
    availableSpaceInPercent() {
      return Math.floor(((this.space - this.usedSpace) / this.space) * 100)
    },
  },
}
</script>
