<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        color="primary"
        v-bind="attrs"
        v-on="on"
        @click="buttonClickHandler"
      >
        <v-icon>mdi-content-paste</v-icon>
      </v-btn>
    </template>

    <span>Paste</span>
  </v-tooltip>
</template>

<script>
import { isFile } from '@/helpers/file'
import fileApi from '@/api/fileApi'
import folderApi from '@/api/folderApi'

export default {
  props: {
    action: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    parentFolder: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      focusItem: null,
    }
  },

  computed: {
    parentFolderId() {
      return this.parentFolder.id
    },
  },

  methods: {
    emitSuccessEvent(item) {
      this.$emit('success', item)
    },
    async buttonClickHandler() {
      this.focusItem = this.items.shift()

      const isFolder = !isFile(this.focusItem)
      const isCopy = this.action.toLowerCase() === 'copy'

      let text = isCopy ? 'Copying' : 'Moving'
      text += ` ${this.focusItem.name} to ${this.parentFolder.name}...`

      this.$overlay.show(text)

      if (!isFolder && isCopy) {
        await this.copyFile()
      } else if (!isFolder && !isCopy) {
        await this.moveFile()
      } else if (isFolder && isCopy) {
        await this.copyFolder()
      } else {
        await this.moveFolder()
      }

      if (this.items.length) {
        this.buttonClickHandler()
      } else {
        this.$emit('done')
      }
    },
    async copyFile() {
      try {
        const { data } = await fileApi.copy(this.focusItem.id, {
          folder_id: this.parentFolderId,
        })

        this.$snackbar.show({
          text: 'Success to copy file.',
        })

        this.emitSuccessEvent(data.data)
      } catch (err) {
        this.$snackbar.show({
          color: 'error',
          text: err?.response?.data?.message || 'Failed to copy file.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    async moveFile() {
      try {
        const { data } = await fileApi.move(this.focusItem.id, {
          folder_id: this.parentFolderId,
        })

        this.$snackbar.show({
          text: 'Success to move file.',
        })

        this.emitSuccessEvent(data.data)
      } catch (err) {
        this.$snackbar.show({
          color: 'error',
          text: err?.response?.data?.message || 'Failed to move file.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    async copyFolder() {
      try {
        const { data } = await folderApi.copy(this.focusItem.id, {
          parent_folder_id: this.parentFolderId,
        })

        this.$snackbar.show({
          text: 'Success to copy folder.',
        })

        this.emitSuccessEvent(data.data)
      } catch (err) {
        this.$snackbar.show({
          color: 'error',
          text: err?.response?.data?.message || 'Failed to copy folder.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    async moveFolder() {
      try {
        const { data } = await folderApi.move(this.focusItem.id, {
          parent_folder_id: this.parentFolderId,
        })

        this.$snackbar.show({
          text: 'Success to move folder.',
        })

        this.emitSuccessEvent(data.data)
      } catch (err) {
        this.$snackbar.show({
          color: 'error',
          text: err?.response?.data?.message || 'Failed to move folder.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
  },
}
</script>
