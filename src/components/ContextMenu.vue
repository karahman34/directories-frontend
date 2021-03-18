<template>
  <div>
    <!-- Menu -->
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

    <!-- Share Link -->
    <input id="share-link" ref="shareLink" type="text" :value="shareLink" />

    <!-- Preview Image Dialog -->
    <preview-image-dialog
      v-if="showPreviewImage"
      v-model="showPreviewImage"
      :src="filePathWithToken"
    ></preview-image-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { fileAuthSrc, fullFileName, isFile, isImage } from '@/helpers/file'
import fileApi from '@/api/fileApi'
import folderApi from '@/api/folderApi'
import PreviewImageDialog from '@/components/Dialogs/PreviewImageDialog'

export default {
  components: {
    PreviewImageDialog,
  },

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
    allowEdit: {
      type: Boolean,
      default: false,
    },
    allowMove: {
      type: Boolean,
      default: false,
    },
    allowRestore: {
      type: Boolean,
      default: false,
    },
    forceDelete: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      show: true,
      showPreviewImage: false,
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
          icon: 'mdi-share',
          text: 'Share Link',
          method: () => this.shareLinkHandler(),
        },
        {
          icon: 'mdi-eye',
          text: 'Make Public',
          method: () => this.changeFileVisibility('public'),
        },
        {
          icon: 'mdi-eye-off',
          text: 'Make Private',
          method: () => this.changeFileVisibility('private'),
        },
        {
          icon: 'mdi-restore',
          text: 'Restore',
          method: () => this.restoreHandler(),
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
    ...mapState('auth', {
      userState: state => state.user,
    }),
    ...mapGetters('auth', {
      trashEnabled: 'trashEnabled',
    }),
    isImage() {
      return isImage(this.item)
    },
    isFile() {
      return isFile(this.item)
    },
    isFolder() {
      return !this.isFile
    },
    itemTrashed() {
      return this.item.deleted_at !== null
    },
    parentTrashed() {
      return this.isFolder
        ? this.item.parent_folder_trashed === 'Y'
        : this.item.folder_trashed === 'Y'
    },
    filePrivate() {
      if (!this.isFile) return null

      return this.item.is_public === 'N' ? true : false
    },
    availableMenus() {
      return this.menus.filter(menu => {
        const name = menu.text.toLowerCase()

        if (name === 'open') {
          return this.isFolder
        } else if (name === 'edit') {
          return this.isFolder && this.allowEdit
        } else if (name === 'copy') {
          return (this.isFolder || this.isFile) && this.allowCopy
        } else if (name === 'move') {
          return (this.isFolder || this.isFile) && this.allowMove
        } else if (name === 'preview') {
          return this.isImage
        } else if (name === 'download') {
          return this.isFile && !this.itemTrashed && !this.parentTrashed
        } else if (name === 'share link') {
          return this.isFile && !this.itemTrashed && !this.parentTrashed
        } else if (name === 'make public') {
          return (
            this.isFile &&
            this.filePrivate &&
            !this.itemTrashed &&
            !this.parentTrashed
          )
        } else if (name === 'make private') {
          return (
            this.isFile &&
            !this.filePrivate &&
            !this.itemTrashed &&
            !this.parentTrashed
          )
        } else if (name === 'restore') {
          return this.allowRestore && !this.parentTrashed
        } else if (name === 'delete') {
          if (!this.allowRestore && this.forceDelete) {
            return true
          } else if (!this.itemTrashed && this.parentTrashed) {
            return false
          } else {
            return true
          }
        }
      })
    },
    filePathWithToken() {
      if (this.isFolder) {
        return null
      }

      return fileAuthSrc(this.item.path)
    },
    shareLink() {
      const routeData = this.$router.resolve({
        name: 'ShareFile',
        params: {
          fileId: this.item.id,
        },
      })
      const link = `${window.origin}${routeData.href}`

      return link
    },
  },

  watch: {
    show(value) {
      if (!value) {
        this.showPreviewImage = false

        this.emitHideEvent()
      }
    },
  },

  methods: {
    ...mapMutations('storage', {
      increaseUsedSpace: 'INCREASE_USED_SPACE',
      decreaseUsedSpace: 'DECREASE_USED_SPACE',
      removeRecentUpload: 'REMOVE_RECENT_UPLOAD',
      setRecentUploads: 'SET_RECENT_UPLOADS',
    }),
    emitHideEvent() {
      this.$emit('hide')
    },
    openHandler() {
      this.$emit('open:folder', this.item)
      this.emitHideEvent()
    },
    previewHandler() {
      this.showPreviewImage = true
    },
    downloadHandler() {
      window.open(this.filePathWithToken)
    },
    restoreHandler() {
      let msg = 'Restoring '
      this.isFile ? fullFileName(this.item) : this.item.name
      msg += '...'

      this.$overlay.show(msg)

      return this.isFile ? this.restoreFile() : this.restoreFolder()
    },
    shareLinkHandler() {
      if (this.filePrivate) {
        this.$snackbar.show({
          color: 'red',
          text: 'File visibility should be a public to share the file.',
        })
      } else {
        const url = this.$refs.shareLink
        console.log(url)
        url.select()
        url.setSelectionRange(0, 99999)

        document.execCommand('copy')

        this.$snackbar.show({
          text: 'The link has been inserted into the clipboard.',
        })

        this.show = false
      }
    },
    async changeFileVisibility(visibility) {
      this.$overlay.show(`Changing ${fullFileName} visibility...`)

      try {
        const res = await fileApi.updateVisibility(this.item.id, {
          _method: 'PATCH',
          is_public: visibility === 'private' ? 'n' : 'y',
        })
        const { data } = res.data

        this.$snackbar.show({
          text: `Success to change ${fullFileName(
            this.item,
          )} visibility to ${visibility}.`,
        })

        this.$emit('change:visibility', data)
        this.setRecentUploads(null)
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text:
            err?.response?.data?.message || 'Failed to change file visibility.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    async restoreFile() {
      try {
        await fileApi.restore(this.item.id)

        this.$snackbar.show({
          text: `Success to restore ${fullFileName(this.item)}`,
        })

        this.increaseUsedSpace(this.item.size)
        this.$emit('restore', this.item)
        this.emitHideEvent()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to restore file.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    async restoreFolder() {
      try {
        await folderApi.restore(this.item.id)

        this.$snackbar.show({
          text: `Success to restore ${this.item.name}`,
        })

        this.increaseUsedSpace(this.item.size)
        this.$emit('restore', this.item)
        this.emitHideEvent()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to restore folder.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    deleteHandler() {
      const msgName = isFile(this.item)
        ? fullFileName(this.item)
        : this.item.name
      this.$overlay.show(`Deleting ${msgName}...`)

      const isFolder = !isFile(this.item)

      if (!this.forceDelete && this.trashEnabled) {
        return isFolder ? this.softDeleteFolder() : this.softDeleteFile()
      } else {
        return isFolder ? this.deleteFolder() : this.deleteFile()
      }
    },
    async deleteFile() {
      try {
        await fileApi.delete(this.item.id)

        this.$snackbar.show({
          text: `${fullFileName(this.item)} was successfully deleted.`,
        })

        this.decreaseUsedSpace(this.item.size)
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
      try {
        await folderApi.delete(this.item.id)

        this.$snackbar.show({
          text: `${this.item.name} was successfully deleted.`,
        })

        this.decreaseUsedSpace(this.item.size)
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
    async softDeleteFile() {
      try {
        await fileApi.softDelete(this.item.id)

        this.$snackbar.show({
          text: `${fullFileName(
            this.item,
          )} was successfully moved to trash bin.`,
        })

        this.$emit('destroy', this.item)
        this.removeRecentUpload(this.item)
        this.emitHideEvent()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text:
            err?.response?.data?.message || 'Failed to move file to trash bin.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
    async softDeleteFolder() {
      try {
        await folderApi.softDelete(this.item.id)

        this.$snackbar.show({
          text: `${this.item.name} was successfully moved to trash bin.`,
        })

        this.$emit('destroy', this.item)
        this.emitHideEvent()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text:
            err?.response?.data?.message ||
            'Failed to move folder to trash bin.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#share-link {
  position: fixed;
  top: -1000px;
  right: -1000px;
}
</style>
