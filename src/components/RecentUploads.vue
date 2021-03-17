<template>
  <div>
    <!-- Title -->
    <div class="mb-1 text-h5 d-flex align-center">
      <v-icon class="text-h5 mr-2 inherit-color">mdi-upload</v-icon>
      <span>Recent Uploads</span>
    </div>

    <!-- Loading -->
    <template v-if="loading">
      <v-progress-circular
        indeterminate
        class="mt-2"
        color="grey"
        :value="20"
      ></v-progress-circular>
    </template>

    <!-- Empty -->
    <template v-else-if="!carouselItems.length">
      <p class="grey--text text--darken-1">You don't have any files.</p>
    </template>

    <!-- Recent Uploads -->
    <v-carousel v-else light hide-delimiters height="fit-content" class="mt-2">
      <v-carousel-item v-for="slide in carouselItems.length" :key="slide">
        <v-row>
          <v-col
            v-for="file in carouselItems[slide - 1]"
            :key="file.id"
            cols="6"
            sm="3"
            lg="2"
          >
            <!-- File Icon -->
            <v-card
              flat
              height="200px"
              class="d-flex justify-center align-center"
              @contextmenu.prevent="contextMenuHandler($event, file)"
            >
              <!-- File -->
              <v-icon v-if="!isImage(file)" class="text-h1">{{
                getIconFile(file)
              }}</v-icon>

              <!-- Image -->
              <v-img
                v-else
                height="100%"
                :src="imgSrcWithToken(file.path)"
              ></v-img>
            </v-card>

            <!-- File Name -->
            <p class="mt-2 text-break">
              {{ fullFileName(file) }}
            </p>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>

    <!-- The Context Menu -->
    <context-menu
      v-if="contextMenu.item !== null"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      :item="contextMenu.item"
      @hide="hideContextMenu"
      @destroy="fileDeletedHandler"
    ></context-menu>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { fullFileName, getIconFile, fileAuthSrc, isImage } from '@/helpers/file'
import ContextMenu from '@/components/ContextMenu'

export default {
  components: {
    ContextMenu,
  },

  data() {
    return {
      loading: false,
      perItem: 6,
      contextMenu: {
        item: null,
        x: null,
        y: null,
      },
    }
  },

  computed: {
    ...mapState('storage', {
      recentUploads: state => state.recentUploads,
    }),
    carouselItems() {
      if (!Array.isArray(this.recentUploads)) {
        return []
      }

      let currIndex = 0

      return this.recentUploads.reduce((arr, file) => {
        if (!arr[currIndex]) {
          arr[currIndex] = [file]
        } else if (this.perItem > arr[currIndex].length) {
          arr[currIndex].push(file)
        } else {
          currIndex += 1
          arr[currIndex] = [file]
        }

        return arr
      }, [])
    },
  },

  mounted() {
    if (this.recentUploads === null) {
      this.getRecentUploads()
    }

    this.setPerItem()
    this.listenResizeEvent()
  },

  methods: {
    ...mapMutations('storage', {
      setRoot: 'SET_ROOT',
    }),
    ...mapActions('storage', {
      recentUploadsAction: 'getRecentUploads',
    }),
    async getRecentUploads() {
      this.loading = true

      try {
        await this.recentUploadsAction()
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text:
            err?.response?.data?.message ||
            'Failed to get recent uploads data.',
        })
      } finally {
        this.loading = false
      }
    },
    isImage(file) {
      return isImage(file)
    },
    fullFileName(file) {
      return fullFileName(file)
    },
    getIconFile(file) {
      return getIconFile(file)
    },
    setPerItem() {
      const width = window.innerWidth

      if (width > 1264) {
        this.perItem = 6
      } else if (width > 600) {
        this.perItem = 4
      } else {
        this.perItem = 4
      }
    },
    listenResizeEvent() {
      window.addEventListener('resize', this.setPerItem)
    },
    removeResizeEvent() {
      window.removeEventListener('resize', this.setPerItem)
    },
    hideContextMenu() {
      this.contextMenu.item = null
      this.contextMenu.x = null
      this.contextMenu.y = null
    },
    contextMenuHandler(e, file) {
      this.contextMenu.item = file
      this.contextMenu.x = e.pageX
      this.contextMenu.y = e.pageY
    },
    fileDeletedHandler() {
      this.setRoot(null)
    },
    imgSrcWithToken(src) {
      return fileAuthSrc(src)
    },
  },

  beforeDestroy() {
    this.removeResizeEvent()
  },
}
</script>
