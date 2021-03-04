<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        color="error"
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

  methods: {
    async runBatchDelete() {
      this.$overlay.show(`Deleting ${this.items.length} items...`)

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
        this.$overlay.hide()
      }
    },
  },
}
</script>
