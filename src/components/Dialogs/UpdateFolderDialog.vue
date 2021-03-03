<template>
  <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-title>
        <v-icon class="grey--text text--darken-1">mdi-folder-edit</v-icon>
        <span class="ml-2 grey--text text--darken-1">Edit Folder</span>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="updateFolder">
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
            >Update</v-btn
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
    value: {
      type: Boolean,
      required: true,
    },
    folder: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      dialog: true,
      loading: false,
      form: {
        name: null,
      },
      errorsField: {
        name: null,
      },
    }
  },

  watch: {
    dialog(dialog) {
      if (dialog !== this.value) {
        this.$emit('change', dialog)
      }
    },
    value: {
      immediate: true,
      handler(value) {
        this.dialog = value
        this.errorsField.name = null
        this.form.name = this.folder.name
      },
    },
  },

  methods: {
    async updateFolder() {
      this.loading = true
      hideValidationErrors(this.errorsField)

      try {
        const res = await folderApi.update(this.folder.id, this.form)
        const { data } = res.data

        this.$emit('updated', data)

        this.dialog = false

        this.$snackbar.show({
          text: 'Folder updated.',
        })
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errorsField)
        } else {
          this.$snackbar.show({
            color: 'red',
            text: err?.response?.data?.message || 'Failed to update folder.',
          })
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
