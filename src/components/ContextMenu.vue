<template>
  <v-menu
    v-model="show"
    :position-x="positionX"
    :position-y="positionY"
    :close-on-content-click="false"
  >
    <v-list dense>
      <v-list-item
        v-for="menu in availableMenus"
        :key="menu.text"
        class="px-4"
        :disabled="menu && menu.loading"
        @click="menu.method(menu)"
      >
        <!-- Icon -->
        <v-list-item-icon class="mr-1">
          <v-icon class="text-h6 grey--text text--darken-2">{{
            menu.icon
          }}</v-icon>
        </v-list-item-icon>

        <!-- Text -->
        <v-list-item-title class="d-flex align-center">
          <span class="text-body-2 grey--text text--darken-2">{{
            menu.text
          }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapMutations } from 'vuex'
import { fullFileName, isFile, isImage } from '@/helpers/file'
import fileApi from '@/api/fileApi'
import folderApi from '@/api/folderApi'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    positionX: {
      type: Number,
      required: true,
    },
    positionY: {
      type: Number,
      required: true,
    },
    allowCopy: {
      type: Boolean,
      default: false,
    },
    allowMove: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      show: true,
      menus: [
        {
          icon: 'mdi-folder-open',
          text: 'Open',
          method: () => this.openHandler(),
        },
        {
          icon: 'mdi-magnify',
          text: 'Preview',
          method: () => this.previewHandler(),
        },
        {
          icon: 'mdi-pencil',
          text: 'Edit',
          method: () => {
            this.$emit('edit:folder', this.item)
            this.emitHideEvent()
          },
        },
        {
          icon: 'mdi-content-copy',
          text: 'Copy',
          method: () => {
            this.$emit('copy', this.item)
            this.emitHideEvent()
          },
        },
        {
          icon: 'mdi-file-move',
          text: 'Move',
          method: () => {
            this.$emit('move', this.item)
            this.emitHideEvent()
          },
        },
        {
          icon: 'mdi-download',
          text: 'Download',
          method: () => this.downloadHandler(),
        },
        {
          icon: 'mdi-trash-can',
          text: 'Delete',
          method: () => this.deleteHandler(),
        },
      ],
    }
  },

  computed: {
    isImage() {
      return isImage(this.item)
    },
    isFile() {
      return isFile(this.item)
    },
    isFolder() {
      return !this.isFile
    },
    availableMenus() {
      return this.menus.filter(menu => {
        const name = menu.text.toLowerCase()

        if (name === 'open') {
          return this.setOpen()
        } else if (name === 'edit') {
          return this.setEdit()
        } else if (name === 'copy') {
          return this.setCopy()
        } else if (name === 'move') {
          return this.setMove()
        } else if (name === 'preview') {
          return this.setPreview()
        } else if (name === 'download') {
          return this.setDownload()
        } else {
          return true
        }
      })
    },
  },

  watch: {
    show(value) {
      if (!value) {
        this.emitHideEvent()
      }
    },
  },

  methods: {
    ...mapMutations('storage', {
      removeRecentUpload: 'REMOVE_RECENT_UPLOAD',
    }),
    emitHideEvent() {
      this.$emit('hide')
    },
    setAvailableMenus() {
      this.setOpen()
      this.setEdit()
      this.setPreview()
      this.setDownload()
    },
    setOpen() {
      return this.isFolder
    },
    setPreview() {
      return this.isImage
    },
    setEdit() {
      return this.isFolder
    },
    setCopy() {
      return (this.isFolder || this.isFile) && this.allowCopy
    },
    setMove() {
      return (this.isFolder || this.isFile) && this.allowMove
    },
    setDownload() {
      return this.isFile
    },
    openHandler() {
      this.$emit('open:folder', this.item)
      this.emitHideEvent()
    },
    previewHandler() {
      window.open(this.item.path)
    },
    downloadHandler() {
      window.open(this.item.path)
    },
    deleteHandler() {
      return isFile(this.item) ? this.deleteFile() : this.deleteFolder()
    },
    async deleteFile() {
      this.$overlay.show('Deleting file...')

      try {
        await fileApi.delete(this.item.id)

        this.$snackbar.show({
          text: `${fullFileName(this.item)} was successfully deleted.`,
        })

        this.removeRecentUpload(this.item)
        this.$emit('destroy', this.item)
        this.emitHideEvent()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to delete file.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    async deleteFolder() {
      this.$overlay.show('Deleting folder...')

      try {
        await folderApi.delete(this.item.id)

        this.$snackbar.show({
          text: `${this.item.name} was successfully deleted.`,
        })

        this.$emit('destroy', this.item)
        this.emitHideEvent()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to delete folder.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
  },
}
</script>
