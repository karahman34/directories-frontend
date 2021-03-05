<template>
  <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-title>
        <v-icon class="grey--text text--darken-1">mdi-file-plus</v-icon>
        <span class="ml-2 grey--text text--darken-1">New File</span>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="createFile">
          <v-file-input
            v-model="form.file"
            show-size
            label="File input"
            :error-messages="errorsField.file"
          ></v-file-input>

          <v-btn
            type="submit"
            :class="{ 'mt-1': errorsField.name !== null }"
            :loading="loading"
            color="primary"
            >Upload</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
import fileApi from '@/api/fileApi'
import {
  hideValidationErrors,
  showValidationErrors,
} from '@/helpers/validationForm'

export default {
  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    folderId: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
      previewImage: null,
      form: {
        file: null,
        folder_id: null,
      },
      errorsField: {
        file: null,
      },
    }
  },

  watch: {
    dialog(val) {
      this.$emit('change', val)
    },
    value(val) {
      this.dialog = val
      this.form.file = null
      this.errorsField.file = null
      this.form.folder_id = this.folderId
    },
  },

  methods: {
    ...mapMutations('storage', {
      increaseUsedSpace: 'INCREASE_USED_SPACE',
      addRecentUpload: 'ADD_RECENT_UPLOAD',
    }),
    async createFile() {
      this.loading = true
      hideValidationErrors(this.errorsField)

      const { file, folder_id } = this.form
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder_id', folder_id)

      try {
        const res = await fileApi.store(formData)
        const { data } = res.data

        this.$emit('created', data)

        this.dialog = false
        this.increaseUsedSpace(data.size)
        this.addRecentUpload(data)

        this.$snackbar.show({
          text: 'File successfully uploaded.',
        })
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errorsField)
        } else {
          this.$snackbar.show({
            color: 'red',
            text: err?.response?.data?.message || 'Failed to create new file.',
          })
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
