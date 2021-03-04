<template>
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        fab
        dark
        color="blue darken-2"
        v-bind="attrs"
        v-on="on"
        @click="buttonClickHandler"
      >
        <v-icon>{{ icon }}</v-icon>
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
    item: {
      type: Object,
      required: true,
    },
    parentFolderId: {
      type: String,
      required: true,
    },
  },

  computed: {
    isCopy() {
      return this.action.toLowerCase() === 'copy'
    },
    isFolder() {
      return !isFile(this.item)
    },
    icon() {
      return this.isCopy ? 'mdi-content-copy' : 'mdi-file-move'
    },
  },

  methods: {
    emitSuccessEvent(item) {
      this.$emit('success', item)
    },
    buttonClickHandler() {
      let text = this.isCopy ? 'Copying' : 'Moving'
      text += this.isFolder ? ' folder' : ' file'
      text += '...'

      this.$overlay.show(text)

      if (this.isFolder) {
        return this.isCopy ? this.copyFolder() : this.moveFolder()
      } else {
        return this.isCopy ? this.copyFile() : this.moveFile()
      }
    },
    async copyFile() {
      try {
        const { data } = await fileApi.copy(this.item.id, {
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
        const { data } = await fileApi.move(this.item.id, {
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
        const { data } = await folderApi.copy(this.item.id, {
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
        const { data } = await folderApi.move(this.item.id, {
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
