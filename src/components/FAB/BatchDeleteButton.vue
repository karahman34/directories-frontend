<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        color="error"
        :loading="loading"
        v-bind="attrs"
        v-on="on"
        @click="runBatchDelete"
      >
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>

    <span>Delete All</span>
  </v-tooltip>
</template>

<script>
import userApi from '@/api/userApi'

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    parentFolderId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
    }
  },

  methods: {
    async runBatchDelete() {
      this.loading = true

      try {
        await userApi.batchDelete({
          _method: 'DELETE',
          ids: this.items.map(item => item.id),
          parent_folder_id: this.parentFolderId,
        })

        this.$snackbar.show({
          text: 'Items deleted.',
        })

        this.$emit('deleted', this.items)
      } catch (err) {
        this.$snackbar.show({
          color: 'error',
          text: err?.response?.data?.message || 'Failed to run batch delete.',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
