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
          hidden: true,
          method: () => this.openHandler(),
        },
        {
          icon: 'mdi-magnify',
          text: 'Preview',
          hidden: true,
          method: () => this.previewHandler(),
        },
        {
          icon: 'mdi-pencil',
          text: 'Edit',
          hidden: true,
          method: () => this.$emit('edit:folder', this.item),
        },
        {
          icon: 'mdi-download',
          text: 'Download',
          hidden: true,
          method: () => this.downloadHandler(),
        },
        {
          icon: 'mdi-trash-can',
          text: 'Delete',
          loading: false,
          hidden: false,
          method: menu => this.deleteHandler(menu),
        },
      ],
    }
  },

  computed: {
    availableMenus() {
      return this.menus.filter(menu => menu.hidden === false)
    },
  },

  watch: {
    show(value) {
      if (!value) {
        this.emitHideEvent()
      }
    },
    item: {
      deep: true,
      immediate: true,
      handler() {
        this.setAvailableMenus()
      },
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
      const open = this.menus.find(menu => menu.text === 'Open')

      open.hidden = !isFile(this.item) ? false : true
    },
    setPreview() {
      const preview = this.menus.find(menu => menu.text === 'Preview')

      preview.hidden = isImage(this.item) ? false : true
    },
    setEdit() {
      if (!isFile(this.item) && !isImage(this.item)) {
        const edit = this.menus.find(menu => menu.text === 'Edit')

        edit.hidden = false
      }
    },
    setDownload() {
      const download = this.menus.find(menu => menu.text === 'Download')

      download.hidden = isFile(this.item) ? false : true
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
