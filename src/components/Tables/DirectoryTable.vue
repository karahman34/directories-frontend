<template>
  <v-card flat class="directory-table-card pb-md-2 px-2">
    <v-data-table
      v-model="selected"
      class="directory-table"
      dense
      disable-pagination
      fixed-header
      height="80vh"
      :loading="loading"
      :headers="headers"
      :items="directories"
      :item-class="itemClass"
      :show-select="showSelect"
      hide-default-footer
      @dblclick:row="rowDoubleClickHandler"
      @contextmenu:row="contextMenuHandler"
    >
      <!-- Slot Top -->
      <template v-slot:top>
        <div class="slot-top pt-3 pb-2 px-4 px-md-5">
          <!-- Breadcrumbs -->
          <v-breadcrumbs
            :items="breadcrumbItems"
            class="trees pa-0 grey--text text--darken-1"
          >
            <!-- Slot Item -->
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                @click="$emit('click:breadcrumbs', item)"
                style="cursor: pointer;"
              >
                <!-- Root -->
                <div
                  v-if="item && item.root === true"
                  class="d-flex align-center"
                >
                  <v-icon>mdi-cloud</v-icon>
                  <span class="ml-2">{{ item.directory.name }}</span>
                </div>

                <!-- Search -->
                <div
                  v-else-if="item && item.search === true"
                  class="d-flex align-center"
                >
                  <v-icon>mdi-magnify</v-icon>
                  <span class="ml-2">{{ item.directory.name }}</span>
                </div>

                <!-- Normal -->
                <template v-else>
                  {{ item.directory.name }}
                </template>
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>

          <!-- Utilities -->
          <div class="utilities">
            <div class="utilities-item" @click="$emit('click:newFolder')">
              <v-icon class="utilities-icon">mdi-folder-plus</v-icon>
              <span class="utilities-text">New Folder</span>
            </div>

            <div class="utilities-item" @click="$emit('click:newFile')">
              <v-icon class="utilities-icon">mdi-file-plus</v-icon>
              <span class="utilities-text">New File</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Slot No Data -->
      <template v-slot:no-data>
        This folder is empty.
      </template>

      <!-- Slot Item Name -->
      <template v-slot:[`item.name`]="{ item }">
        <!-- File -->
        <div v-if="isFile(item)" class="d-flex align-center">
          <!-- Image -->
          <v-img
            v-if="isImage(item)"
            height="22px"
            max-width="22px"
            :src="item.path"
          ></v-img>

          <!-- Normal Icon -->
          <v-icon v-else>{{ getIconFile(item) }}</v-icon>

          <span class="ml-3">{{ fullFileName(item) }}</span>
        </div>

        <!-- Folder -->
        <div v-else class="d-flex align-center">
          <v-icon>mdi-folder</v-icon>
          <span class="ml-3">{{ item.name }}</span>
        </div>
      </template>

      <!-- Slot Item Type -->
      <template v-slot:[`item.mime_type`]="{ item }">
        <template v-if="isFile(item)">
          {{ item.mime_type }}
        </template>

        <template v-else>
          Folder
        </template>
      </template>

      <!-- Slot Item Size -->
      <template v-slot:[`item.size`]="{ item }">
        {{ formatSize(item.size) }}
      </template>

      <!-- Slot Item Date Added -->
      <template v-slot:[`item.created_at`]="{ item }">
        {{ formatDateAdded(item.created_at) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import moment from 'moment'
import {
  formatFileSize,
  fullFileName,
  getIconFile,
  isFile,
  isImage,
} from '@/helpers/file'
import { byteToGb, byteToKb, byteToMb } from '@/helpers/storage'

export default {
  props: {
    directories: {
      type: Array,
      required: true,
    },
    breadcrumbItems: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showSelect: {
      type: Boolean,
      required: true,
    },
    itemClass: {
      type: Function,
      default: undefined,
    },
    value: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    headers: [
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Type',
        value: 'mime_type',
      },
      {
        text: 'Size',
        value: 'size',
      },
      {
        text: 'Date Added',
        value: 'created_at',
      },
    ],
    selected: [],
  }),

  watch: {
    selected(selected) {
      return this.$emit('input', selected)
    },
    value(value) {
      this.selected = value
    },
  },

  methods: {
    isFile(item) {
      return isFile(item)
    },
    isImage(item) {
      return isImage(item)
    },
    fullFileName(item) {
      return fullFileName(item)
    },
    formatSize(size) {
      const gb = 1073741824
      const mb = 1048576

      if (size > gb) {
        return `${formatFileSize(byteToGb(size))} GB`
      } else if (size > mb) {
        return `${formatFileSize(byteToMb(size))} MB`
      } else {
        return `${formatFileSize(byteToKb(size))} KB`
      }
    },
    formatDateAdded(created_at) {
      return moment(created_at).format('L HH:mm')
    },
    getIconFile(item) {
      return getIconFile(item)
    },
    rowDoubleClickHandler(e, val) {
      this.$emit('dblClick:row', val.item)
    },
    contextMenuHandler(e, val) {
      e.preventDefault()

      this.$emit('contextmenu:row', e, val.item)
    },
  },
}
</script>

<style lang="scss" scoped>
.directory-table-card {
  .directory-table {
    .slot-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media screen and (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;

        .trees {
          margin-bottom: 0.25rem;
        }
      }

      @media screen and (min-width: 600px) {
        .trees {
          max-width: 70%;
        }
      }

      .utilities {
        display: flex;
        align-items: center;

        .utilities-item,
        .utilities-icon {
          color: #455a64;
        }

        .utilities-item {
          display: flex;
          align-items: center;
          justify-content: end;

          &:hover {
            cursor: pointer;
            color: rgba(69, 90, 100, 0.7);
          }

          &:not(:last-child) {
            margin-right: 0.75rem;
          }

          .utilities-icon {
            font-size: 20px;
          }

          .utilities-text {
            margin-left: 0.25rem;
          }
        }
      }
    }
  }
}
</style>
