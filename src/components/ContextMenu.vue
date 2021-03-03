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
        <!-- Normal Icon -->
        <v-list-item-icon class="mr-1">
          <!-- Loading Spinner -->
          <v-progress-circular
            v-if="menu.loading"
            indeterminate
            width="2"
            size="17"
            color="grey darken-2"
          ></v-progress-circular>

          <!-- Normal Icon -->
          <v-icon v-else class="text-h6 grey--text text--darken-2">{{
            menu.icon
          }}</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="d-flex align-center">
          <!-- Text -->
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
          method: () => this.$emit('edit:folder', this.item),
        },
        {
          icon: 'mdi-download',
          text: 'Download',
          method: () => this.downloadHandler(),
        },
        {
          icon: 'mdi-trash-can',
          text: 'Delete',
          loading: false,
          method: menu => this.deleteHandler(menu),
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
    deleteHandler(menu) {
      menu.loading = true

      return isFile(this.item) ? this.deleteFile(menu) : this.deleteFolder(menu)
    },
    async deleteFile(menu) {
      try {
        await fileApi.delete(this.item.id)

        this.$snackbar.show({
          text: `${fullFileName(this.item)} was successfully deleted.`,
        })

        this.emitHideEvent()
        this.removeRecentUpload(this.item)
        this.$emit('delete:file', this.item)
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to delete file.',
        })
      } finally {
        menu.loading = false
      }
    },
    async deleteFolder(menu) {
      try {
        await folderApi.delete(this.item.id)

        this.$snackbar.show({
          text: `${this.item.name} was successfully deleted.`,
        })

        this.emitHideEvent()
        this.$emit('delete:folder', this.item)
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to delete folder.',
        })
      } finally {
        menu.loading = false
      }
    },
  },
}
</script>
