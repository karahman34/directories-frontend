<template>
  <div id="dashboard-page">
    <!-- Header -->
    <v-row v-if="!getStorageLoading && space !== null && usedSpace !== null">
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
import { mapActions, mapState } from 'vuex'
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

  data: () => ({
    getStorageLoading: false,
  }),

  computed: {
    ...mapState('storage', {
      space: state => state.space,
      usedSpace: state => state.usedSpace,
    }),
  },

  mounted() {
    if (this.space === null || this.usedSpace === null) {
      this.getStorage()
    }
  },

  methods: {
    ...mapActions('storage', {
      getStorageAction: 'getStorage',
    }),
    async getStorage() {
      this.getStorageLoading = true
      this.$overlay.show()

      try {
        await this.getStorageAction()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to get storage data.',
        })
      } finally {
        this.getStorageLoading = false
        this.$overlay.hide()
      }
    },
  },
}
</script>
