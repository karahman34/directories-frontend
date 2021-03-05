<template>
  <div>
    <!-- Directory Table -->
    <directory-table
      v-model="selectedItems"
      show-search
      hide-creation
      :directories="currentDirectories"
      :breadcrumb-items="breadcrumbItems"
      :loading="getDirectoriesLoading"
      @dblClick:row="dblClickRowHandler"
      @contextmenu:row="openContextMenu"
      @click:breadcrumbs="breadcrumbClickHandler"
    ></directory-table>

    <!-- Context Menu -->
    <context-menu
      v-if="contextMenu.value"
      force-delete
      allow-restore
      :item="contextMenu.item"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      @hide="hideContextMenu"
      @open:folder="dblClickRowHandler"
      @restore="actionSuccessHandler"
      @destroy="actionSuccessHandler"
    ></context-menu>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { setSubFoldersObject } from '@/helpers/storage'
import { isFile } from '@/helpers/file'
import trashApi from '@/api/trashApi'
import ContextMenu from '@/components/ContextMenu'
import DirectoryTable from '@/components/Tables/DirectoryTable'

export default {
  components: {
    ContextMenu,
    DirectoryTable,
  },

  data() {
    return {
      selectedItems: [],
      root: null,
      activeDirectory: null,
      currentDirectories: [],
      getDirectoriesLoading: true,
      breadcrumbItems: [],
      contextMenu: {
        value: false,
        item: null,
        x: null,
        y: null,
      },
    }
  },

  mounted() {
    this.fetchRootDirectory()
  },

  methods: {
    ...mapMutations('storage', {
      setRootMutation: 'SET_ROOT',
    }),
    syncLocalRoot() {
      this.syncRootMutation(this.root)
    },
    setCurrentDirectories() {
      if (this.activeDirectory.directories === null) {
        return this.fetchChildDirectories()
      }

      this.currentDirectories = this.activeDirectory.directories
    },
    async fetchRootDirectory() {
      this.getDirectoriesLoading = true

      try {
        const { data } = await trashApi.index()
        const { folders, files } = data.data

        setSubFoldersObject(folders)

        this.root = {
          name: 'trash',
          directories: [...folders, ...files],
        }
        this.activeDirectory = this.root
        this.breadcrumbItems = [
          {
            trash: true,
            directory: this.activeDirectory,
          },
        ]

        this.setCurrentDirectories()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to fetch trash items.',
        })
      } finally {
        this.getDirectoriesLoading = false
      }
    },
    async fetchChildDirectories() {
      this.getDirectoriesLoading = true

      try {
        const { data } = await trashApi.show(this.activeDirectory.id)
        const { sub_folders, files } = data.data

        setSubFoldersObject(sub_folders)

        this.activeDirectory.directories = [...sub_folders, ...files]
        this.setCurrentDirectories()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text:
            err?.response?.data?.message ||
            'Failed to fetch trash child directories.',
        })
      } finally {
        this.getDirectoriesLoading = false
      }
    },
    dblClickRowHandler(directory) {
      if (!isFile(directory)) {
        this.activeDirectory = directory

        this.breadcrumbItems.push({
          directory,
        })

        this.setCurrentDirectories()
      }
    },
    breadcrumbClickHandler(breadcrumbItem) {
      this.breadcrumbItems.splice(
        this.breadcrumbItems.indexOf(breadcrumbItem) + 1,
      )

      this.activeDirectory = breadcrumbItem.directory
      this.setCurrentDirectories()
    },
    openContextMenu(event, directory) {
      this.contextMenu.value = true
      this.contextMenu.item = directory
      this.contextMenu.x = event.pageX
      this.contextMenu.y = event.pageY
    },
    hideContextMenu() {
      this.contextMenu.value = null
      this.contextMenu.item = null
      this.contextMenu.x = null
      this.contextMenu.y = null
    },
    actionSuccessHandler() {
      this.setRootMutation(null)
      this.activeDirectory = null
      this.currentDirectories = []

      this.fetchRootDirectory()
    },
  },
}
</script>
