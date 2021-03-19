<template>
  <div id="share-page">
    <!-- Img -->
    <v-img v-if="isImage" max-height="400px" :src="srcWithToken"></v-img>

    <!-- Video -->
    <video-player
      v-if="isVideo && playerOptions.sources.length"
      class="video-player-box vjs-big-play-centered"
      :options="playerOptions"
      :playsinline="true"
    ></video-player>

    <!-- File Card Info -->
    <v-sheet
      v-if="file"
      class="file-info-card px-3 py-3 mt-4 elevation-3 rounded"
    >
      <div class="d-flex">
        <!-- Left -->
        <div
          v-if="!isImage && !isVideo"
          class="left d-flex align-center justify-center px-6"
        >
          <v-icon class="text-h1">{{ fileIcon }}</v-icon>
        </div>

        <!-- Right -->
        <div class="right flex-grow-1">
          <!-- Name & Size -->
          <div class="d-flex flex-wrap">
            <span class="font-weight-medium mr-1">{{ fileName }}</span>
            <span class="grey--text text--darken-1">({{ fileSize }})</span>
          </div>

          <!-- Info Bottom -->
          <div class="mt-2">
            <!-- Upload Date -->
            <span class="grey--text text--darken-2"
              >Uploaded At: {{ uploadDate }}</span
            >
          </div>

          <v-divider class="my-2"></v-divider>

          <!-- Download -->
          <div class="d-flex justify-end">
            <v-btn color="success" @click="downloadFile">
              <v-icon class="mr-1">mdi-download</v-icon>
              <span>Download</span>
            </v-btn>
          </div>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import fileApi from '@/api/fileApi'
import {
  fileAuthSrc,
  formatFileSize,
  fullFileName,
  getIconFile,
  isImage,
  isVideo,
} from '@/helpers/file'
import { byteToGb, byteToKb, byteToMb } from '@/helpers/storage'
import moment from 'moment'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { setWindowTitle } from '@/helpers/app'
import { mapState } from 'vuex'

export default {
  components: {
    videoPlayer,
  },

  data() {
    return {
      file: null,
      playerOptions: {
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [],
        fluid: true,
      },
    }
  },

  computed: {
    ...mapState('auth', {
      loggedInState: state => state.loggedIn,
    }),
    fileId() {
      return this.$route.params.fileId
    },
    isImage() {
      if (!this.file) return false

      return isImage(this.file)
    },
    isVideo() {
      if (!this.file) return false

      return isVideo(this.file)
    },
    fileName() {
      if (!this.file) return null

      return fullFileName(this.file)
    },
    fileSize() {
      if (!this.file) return null

      const gb = 1073741824
      const mb = 1048576
      const size = this.file.size

      if (size > gb) {
        return `${formatFileSize(byteToGb(size))} GB`
      } else if (size > mb) {
        return `${formatFileSize(byteToMb(size))} MB`
      } else {
        return `${formatFileSize(byteToKb(size))} KB`
      }
    },
    uploadDate() {
      if (!this.file) return null

      return moment(this.file.created_at).format('DD/MM/YYYY')
    },
    fileIcon() {
      if (!this.file) return null

      return getIconFile(this.file)
    },
    srcWithToken() {
      if (!this.file) return null
      if (!this.loggedInState) return this.file.path

      return fileAuthSrc(this.file.path)
    },
  },

  mounted() {
    this.fetchFileInfo()
  },

  methods: {
    async fetchFileInfo() {
      this.$overlay.show('Getting file info...')

      try {
        const res = await fileApi.show(this.fileId)
        const { data } = res.data

        this.file = data

        this.playerOptions.sources.push({
          src: this.srcWithToken,
          type: this.file.mime_type,
        })

        setWindowTitle(this.fileName)
      } catch (err) {
        const errCode = err?.response?.status || 500

        this.$router.replace({
          name: 'ErrorPage',
          params: {
            code: errCode,
          },
        })
      } finally {
        this.$overlay.hide()
      }
    },
    downloadFile() {
      window.open(this.srcWithToken)
    },
  },
}
</script>

<style lang="scss" scoped>
#share-page {
  max-width: 750px;
  margin: 0 auto;
}
</style>
