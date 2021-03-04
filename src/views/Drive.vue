<template>
  <div id="drive-page">
    <!-- The Directory Table -->
    <directory-table
      v-model="selectedItems"
      :breadcrumb-items="breadcrumbItems"
      :loading="getDirectoriesLoading"
      :directories="currentDirectories"
      :show-select="!searchActive"
      :item-class="rowItemClasses"
      @dblClick:row="rowClickHandler"
      @click:breadcrumbs="breadcrumbsClickHandler"
      @click:newFolder="showCreateFolderDialog = !showCreateFolderDialog"
      @click:newFile="showCreateFileDialog = !showCreateFileDialog"
      @contextmenu:row="contextMenuHandler"
    ></directory-table>

    <!-- The Create Folder Dialog -->
    <create-folder-dialog
      v-if="activeDirectory"
      v-model="showCreateFolderDialog"
      :folder-id="activeDirectory.id"
      @created="folderCreatedHandler"
    ></create-folder-dialog>

    <!-- The Update Folder Dialog -->
    <update-folder-dialog
      v-if="folderEdit !== null"
      v-model="showFolderUpdateDialog"
      :folder="folderEdit"
      @updated="folderUpdatedHandler"
    ></update-folder-dialog>

    <!-- The Create File Dialog -->
    <create-file-dialog
      v-if="activeDirectory"
      v-model="showCreateFileDialog"
      :folder-id="activeDirectory.id"
      @created="fileCreatedHandler"
    ></create-file-dialog>

    <!-- The Context Menu -->
    <context-menu
      v-if="contextMenu.item !== null"
      :allow-copy="!searchActive"
      :allow-move="!searchActive"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      :item="contextMenu.item"
      @hide="hideContextMenu"
      @copy="setCopyMove('copy', $event)"
      @move="setCopyMove('move', $event)"
      @open:folder="rowClickHandler"
      @edit:folder="
        ;(folderEdit = $event),
          (showFolderUpdateDialog = !showFolderUpdateDialog)
      "
      @destroy="fileOrFolderDeletedHandler"
    ></context-menu>

    <!-- FAB Stock -->
    <fab-stock>
      <!-- Cancel Copy Move Button -->
      <cancel-copy-move-button
        v-if="copyMove.value"
        :action="copyMove.action"
        @cancel="hideCopyMove"
      ></cancel-copy-move-button>

      <!-- Paste Button -->
      <paste-button
        v-if="copyMove.value"
        :parent-folder-id="activeDirectory.id"
        :item="copyMove.item"
        :action="copyMove.action"
        @success="successCopyMoveHandler"
      ></paste-button>

      <!-- The Batch Delete FAB -->
      <batch-delete-button
        v-if="!searchActive && selectedItems.length"
        :items="selectedItems"
        :parent-folder-id="activeDirectory.id"
        @deleted="batchItemsDeletedHandler"
      ></batch-delete-button>
    </fab-stock>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { isFile } from '@/helpers/file'
import userApi from '@/api/userApi'
import folderApi from '@/api/folderApi'
import { setDirectoryObject, setSubFoldersObject } from '@/helpers/storage'
import FABStock from '@/components/FAB/FABStock'
import BatchDeleteButton from '@/components/FAB/BatchDeleteButton'
import CancelCopyMoveButton from '@/components/FAB/CancelCopyMoveButton'
import CreateFolderDialog from '@/components/Dialogs/CreateFolderDialog'
import CreateFileDialog from '@/components/Dialogs/CreateFileDialog'
import ContextMenu from '@/components/ContextMenu'
import DirectoryTable from '@/components/Tables/DirectoryTable'
import UpdateFolderDialog from '@/components/Dialogs/UpdateFolderDialog'
import PasteButton from '@/components/FAB/PasteButton'

export default {
  name: 'DrivePage',

  components: {
    'fab-stock': FABStock,
    BatchDeleteButton,
    DirectoryTable,
    CancelCopyMoveButton,
    ContextMenu,
    CreateFolderDialog,
    CreateFileDialog,
    UpdateFolderDialog,
    PasteButton,
  },

  data() {
    return {
      root: null,
      breadcrumbItems: [],
      selectedItems: [],
      activeDirectory: null,
      currentDirectories: [],
      getDirectoriesLoading: false,
      showCreateFolderDialog: false,
      showCreateFileDialog: false,
      itemChange: false,
      contextMenu: {
        item: null,
        x: null,
        y: null,
      },
      showFolderUpdateDialog: false,
      folderEdit: null,
      copyMove: {
        action: null,
        value: false,
        item: null,
        fromDirectory: null,
      },
    }
  },

  computed: {
    ...mapState('storage', {
      rootState: state => state.root,
      searchState: state => state.search,
    }),
    searchActive() {
      return this.searchState !== null && this.searchState.length
    },
  },

  watch: {
    searchState: {
      immediate: true,
      handler() {
        if (this.searchActive) {
          this.root = null
          this.activeDirectory = null
          this.currentDirectories = []
          this.breadcrumbItems = []

          this.hideCopyMove()
          this.searchDirectories()
        } else if (this.rootState === null) {
          this.getRootDirectory()
        } else {
          this.startRoot()
        }
      },
    },
    itemChange(value) {
      if (value && this.searchActive) {
        this.setRootMutation(null)
      }
    },
    copyMove: {
      deep: true,
      handler(dialog) {
        if (!dialog.value) {
          this.hideCopyMove()
        }
      },
    },
  },

  methods: {
    ...mapMutations('storage', {
      setRootMutation: 'SET_ROOT',
      setRecentUploads: 'SET_RECENT_UPLOADS',
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
    async searchDirectories() {
      this.getDirectoriesLoading = true

      try {
        const res = await userApi.search({
          q: this.searchState,
        })
        const { data } = res.data
        const { folders, files } = data

        setSubFoldersObject(folders)

        this.currentDirectories = [...folders, ...files]
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to search directories.',
        })
      } finally {
        this.getDirectoriesLoading = false
      }
    },
    startRoot() {
      this.root = { ...this.rootState }
      this.activeDirectory = this.root
      this.breadcrumbItems = [
        {
          root: true,
          directory: this.activeDirectory,
        },
      ]

      this.setCurrentDirectories()
    },
    syncLocalRoot() {
      if (!this.searchActive) {
        this.setRootMutation(this.root)
      }
    },
    setCurrentDirectories() {
      this.currentDirectories = this.activeDirectory.directories
    },
    rowClickHandler(directory) {
      const { value, item } = this.copyMove

      if (isFile(directory) || (value && item.id === directory.id)) return

      this.activeDirectory = directory

      if (this.searchActive && !this.breadcrumbItems.length) {
        this.breadcrumbItems.push({
          search: true,
          directory: this.activeDirectory,
        })
      } else {
        this.breadcrumbItems.push({
          directory: this.activeDirectory,
        })
      }

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
    folderCreatedHandler(folder) {
      folder.directories = null

      delete folder.files
      delete folder.sub_folders

      this.currentDirectories.unshift(folder)
      this.syncLocalRoot()

      if (this.searchActive) {
        this.itemChange = true
      }
    },
    folderUpdatedHandler(folder) {
      folder.directories = null

      delete folder.files
      delete folder.sub_folders

      const targetIndex = this.currentDirectories.findIndex(
        fol => fol.id === folder.id,
      )

      if (targetIndex >= 0) {
        this.currentDirectories.splice(targetIndex, 1, folder)
      }

      if (this.searchActive) {
        this.itemChange = true
      }
    },
    fileCreatedHandler(file) {
      this.currentDirectories.unshift(file)
      this.syncLocalRoot()

      if (this.searchActive) {
        this.itemChange = true
      }
    },
    hideContextMenu() {
      this.contextMenu.item = null
      this.contextMenu.x = null
      this.contextMenu.y = null
    },
    contextMenuHandler(e, item) {
      this.contextMenu.item = item
      this.contextMenu.x = e.pageX
      this.contextMenu.y = e.pageY
    },
    fileOrFolderDeletedHandler(item) {
      if (
        !isFile(item) &&
        (item.directories === null || (item && item.directories.length))
      ) {
        this.setRecentUploads(null)
      }

      this.currentDirectories.splice(
        this.currentDirectories.findIndex(x => x.id === item.id),
        1,
      )

      this.syncLocalRoot()

      if (this.searchActive) {
        this.itemChange = true
      }
    },
    batchItemsDeletedHandler(items) {
      const deletedIds = items.map(item => item.id)

      this.activeDirectory.directories = this.currentDirectories.filter(
        dir => !deletedIds.includes(dir.id),
      )

      this.selectedItems = []

      this.syncLocalRoot()
      this.setRecentUploads(null)
      this.setCurrentDirectories()
    },
    setCopyMove(action, item) {
      this.copyMove.action = action
      this.copyMove.value = true
      this.copyMove.item = item
      this.copyMove.fromDirectory = this.activeDirectory
    },
    hideCopyMove() {
      this.copyMove.action = null
      this.copyMove.value = false
      this.copyMove.item = null
      this.copyMove.fromDirectory = null
    },
    successCopyMoveHandler(item) {
      const { action, fromDirectory } = this.copyMove
      if (action.toLowerCase() === 'move') {
        fromDirectory.directories.splice(
          fromDirectory.directories.findIndex(dir => dir.id === item.id),
          1,
        )
      }

      if (isFile(item)) {
        this.fileCreatedHandler(item)
      } else {
        this.folderCreatedHandler(item)
      }

      this.hideCopyMove()
    },
    rowItemClasses(rowItem) {
      let classes = ''
      const { item, value } = this.copyMove
      if (value && item.id === rowItem.id) {
        classes += 'grey--text text--lighten-1 cursor-not-allowed'
      }

      return classes
    },
  },
}
</script>
