<template>
  <div id="drive-page">
    <directory-table
      :breadcrumb-items="breadcrumbItems"
      :loading="getDirectoriesLoading"
      :directories="currentDirectories"
      @sort:size="sortBySize"
      @click:row="rowClickHandler"
      @click:breadcrumbs="breadcrumbsClickHandler"
      @click:newFolder="showCreateFolderDialog = !showCreateFolderDialog"
      @click:newFile="showCreateFileDialog = !showCreateFileDialog"
    ></directory-table>

    <create-folder-dialog
      v-if="activeDirectory"
      v-model="showCreateFolderDialog"
      :folder-id="activeDirectory.id"
      @created="folderCreatedHandler"
    ></create-folder-dialog>

    <create-file-dialog
      v-if="activeDirectory"
      v-model="showCreateFileDialog"
      :folder-id="activeDirectory.id"
      @created="fileCreatedHandler"
    ></create-file-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { isFile } from '@/helpers/file'
import DirectoryTable from '@/components/Tables/DirectoryTable'
import folderApi from '@/api/folderApi'
import { setDirectoryObject } from '@/helpers/storage'
import CreateFolderDialog from '@/components/Dialogs/CreateFolderDialog'
import CreateFileDialog from '@/components/Dialogs/CreateFileDialog'

export default {
  name: 'DrivePage',

  components: {
    DirectoryTable,
    CreateFolderDialog,
    CreateFileDialog,
  },

  data() {
    return {
      root: null,
      breadcrumbItems: [],
      activeDirectory: null,
      currentDirectories: [],
      getDirectoriesLoading: false,
      showCreateFolderDialog: false,
      showCreateFileDialog: false,
    }
  },

  computed: {
    ...mapState('storage', {
      rootState: state => state.root,
    }),
  },

  mounted() {
    if (this.rootState === null) {
      this.getRootDirectory()
    } else {
      this.startRoot()
    }
  },

  methods: {
    ...mapMutations('storage', {
      setRootMutation: 'SET_ROOT',
    }),
    ...mapActions('storage', {
      getRootDirectoryAction: 'getRootDirectory',
    }),
    async getRootDirectory() {
      this.getDirectoriesLoading = true

      try {
        await this.getRootDirectoryAction()

        this.$nextTick(() => {
          this.startRoot()
        })
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text:
            err?.response?.data?.message || 'Failed to get user directories.',
        })
      } finally {
        this.getDirectoriesLoading = false
      }
    },
    async getChildDirectories() {
      this.currentDirectories = []
      this.getDirectoriesLoading = true

      try {
        const res = await folderApi.getDetail(this.activeDirectory.id)
        const { data } = res.data

        setDirectoryObject(data)
        this.activeDirectory.directories = data.directories

        this.setCurrentDirectories()
        this.syncLocalRoot()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: 'Failed to fetch child directories.',
        })
      } finally {
        this.getDirectoriesLoading = false
      }
    },
    startRoot() {
      this.root = { ...this.rootState }
      this.activeDirectory = this.root
      this.breadcrumbItems.push({
        root: true,
        directory: this.activeDirectory,
      })

      this.setCurrentDirectories()
    },
    syncLocalRoot() {
      this.setRootMutation(this.root)
    },
    setCurrentDirectories() {
      this.currentDirectories = this.activeDirectory.directories
    },
    rowClickHandler(directory) {
      if (isFile(directory)) return

      this.activeDirectory = directory
      this.breadcrumbItems.push({
        directory: this.activeDirectory,
      })

      if (this.activeDirectory.directories === null) {
        return this.getChildDirectories()
      } else {
        this.setCurrentDirectories()
      }
    },
    breadcrumbsClickHandler(item) {
      this.activeDirectory = item.directory
      this.setCurrentDirectories()

      this.breadcrumbItems.splice(this.breadcrumbItems.indexOf(item) + 1)
    },
    sortBySize(desc) {
      this.currentDirectories.sort((a, b) => {
        const size1 = a.size
        const size2 = b.size

        if (!desc) {
          if (size1 < size2) {
            return -1
          } else if (size1 > size2) {
            return 1
          } else {
            return 0
          }
        } else {
          if (size1 < size2) {
            return 1
          } else if (size1 > size2) {
            return -1
          } else {
            return 0
          }
        }
      })
    },
    folderCreatedHandler(folder) {
      folder.directories = null

      delete folder.files
      delete folder.sub_folders

      this.currentDirectories.unshift(folder)
      this.syncLocalRoot()
    },
    fileCreatedHandler(file) {
      this.currentDirectories.unshift(file)
      this.syncLocalRoot()
    },
  },
}
</script>
