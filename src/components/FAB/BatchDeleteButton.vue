<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        color="error"
        v-bind="attrs"
        v-on="on"
        @click="buttonClickHandler"
      >
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>

    <span>Delete All</span>
  </v-tooltip>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
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

  computed: {
    ...mapState('auth', {
      userState: state => state.user,
    }),
    itemsLength() {
      return this.items.length
    },
    listIds() {
      return this.items.map(item => item.id)
    },
    trashEnabled() {
      return this.userState.settings.trash === 'enable'
    },
  },

  methods: {
    ...mapMutations('storage', {
      decreaseUsedSpace: 'DECREASE_USED_SPACE',
    }),
    buttonClickHandler() {
      this.trashEnabled ? this.runSoftBatchDelete() : this.runBatchDelete()
    },
    emitDeletedEvent() {
      return this.$emit('deleted', this.items)
    },
    async runBatchDelete() {
      this.$overlay.show(`Deleting ${this.itemsLength} items...`)

      try {
        await userApi.batchDelete({
          _method: 'DELETE',
          ids: this.listIds,
          parent_folder_id: this.parentFolderId,
        })

        this.$snackbar.show({
          text: `${this.itemsLength} items was deleted successfully.`,
        })

        // Get total items size.
        const totalSize = this.items.reduce(
          (total, item) => total + item.size,
          0,
        )

        this.decreaseUsedSpace(totalSize)
        this.emitDeletedEvent()
      } catch (err) {
        this.$snackbar.show({
          color: 'error',
          text: err?.response?.data?.message || 'Failed to run batch delete.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    async runSoftBatchDelete() {
      this.$overlay.show(`Deleting ${this.itemsLength} items...`)

      try {
        await userApi.softBatchDelete({
          _method: 'DELETE',
          ids: this.listIds,
        })

        this.$snackbar.show({
          text: `${this.itemsLength} items was successfully moved to trash bin.`,
        })

        this.emitDeletedEvent()
      } catch (err) {
        this.$snackbar.show({
          color: 'error',
          text:
            err?.response?.data?.message || 'Failed to run soft batch delete.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
  },
}
</script>
