<template>
  <div id="dashboard-page">
    <!-- Header -->
    <v-row v-if="space !== null && usedSpace !== null">
      <v-col cols="12" md="4">
        <overall-usage :space="space" :used-space="usedSpace"></overall-usage>
      </v-col>

      <v-col cols="12" md="4">
        <used-storage :space="space" :used-space="usedSpace"></used-storage>
      </v-col>
    </v-row>

    <!-- Recent Uploads -->
    <recent-uploads class="mt-5"></recent-uploads>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OverallUsage from '@/components/Storage/OverallUsage'
import UsedStorage from '@/components/Storage/UsedStorage'
import RecentUploads from '@/components/RecentUploads'

export default {
  name: 'DashboardPage',

  components: {
    OverallUsage,
    UsedStorage,
    RecentUploads,
  },

  computed: {
    ...mapState('storage', {
      space: state => state.space,
      usedSpace: state => state.usedSpace,
    }),
  },
}
</script>
