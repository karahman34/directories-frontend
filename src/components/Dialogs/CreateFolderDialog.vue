<template>
  <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-title>
        <v-icon class="grey--text text--darken-1">mdi-folder-plus</v-icon>
        <span class="ml-2 grey--text text--darken-1">New Folder</span>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="createFolder">
          <v-text-field
            v-model="form.name"
            :error-messages="errorsField.name"
            label="Folder Name"
            prepend-inner-icon="mdi-folder"
          ></v-text-field>

          <v-btn
            type="submit"
            :class="{ 'mt-1': errorsField.name !== null }"
            :loading="loading"
            color="primary"
            >Create</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import folderApi from '@/api/folderApi'
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
      form: {
        name: null,
        parent_folder_id: null,
      },
      errorsField: {
        name: null,
      },
    }
  },

  watch: {
    dialog(val) {
      this.$emit('change', val)
    },
    value(val) {
      this.dialog = val
      this.form.name = null
      this.errorsField.name = null
      this.form.parent_folder_id = this.folderId
    },
  },

  methods: {
    async createFolder() {
      this.loading = true
      hideValidationErrors(this.errorsField)

      try {
        const res = await folderApi.store(this.form)
        const { data } = res.data

        this.$emit('created', data)

        this.dialog = false

        this.$snackbar.show({
          text: 'Folder created',
        })
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errorsField)
        } else {
          this.$snackbar.show({
            color: 'red',
            text:
              err?.response?.data?.message || 'Failed to create new folder.',
          })
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
