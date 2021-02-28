<template>
  <div>
    <v-alert v-if="errorMsg" class="auth-card mb-4 rounded-lg" type="error">
      {{ errorMsg }}
    </v-alert>

    <v-card class="auth-card rounded-lg">
      <v-card-title class="text-center">
        <logo size="h5"></logo>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="goRegister">
          <!-- Name -->
          <v-text-field
            v-model="form.name"
            id="name"
            label="Name"
            placeholder="Enter you Name"
            prepend-inner-icon="mdi-account"
            :error-messages="errorFields.email"
          ></v-text-field>

          <!-- Email -->
          <v-text-field
            v-model="form.email"
            id="email"
            label="Email"
            placeholder="Enter you Email"
            prepend-inner-icon="mdi-email"
            :error-messages="errorFields.email"
          ></v-text-field>

          <!-- Password -->
          <v-text-field
            v-model="form.password"
            id="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-inner-icon="mdi-lock"
            placeholder="Enter your password"
            :append-icon="!showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :error-messages="errorFields.password"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <!-- Password Confirmation -->
          <v-text-field
            v-model="form.password_confirmation"
            id="password_confirmation"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            label="Repeat Password"
            prepend-inner-icon="mdi-lock"
            placeholder="Repeat your password"
            :append-icon="!showPasswordConfirmation ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPasswordConfirmation = !showPasswordConfirmation"
          ></v-text-field>

          <!-- Footer -->
          <div class="d-flex justify-space-between align-center">
            <router-link :to="{ name: 'Login' }"
              >Already have an account ?</router-link
            >

            <v-btn type="submit" color="primary" :loading="loading"
              >Register</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  hideValidationErrors,
  showValidationErrors,
} from '@/helpers/validationForm'
import Logo from '@/components/Logo'

export default {
  components: {
    Logo,
  },

  data: () => ({
    errorMsg: null,
    loading: false,
    showPassword: false,
    showPasswordConfirmation: false,
    form: {
      name: null,
      email: null,
      password: null,
      password_confirmation: null,
    },
    errorFields: {
      name: null,
      email: null,
      password: null,
    },
  }),

  methods: {
    ...mapActions('auth', {
      registerAction: 'register',
    }),
    async goRegister() {
      this.loading = true
      this.errorMsg = null
      hideValidationErrors(this.errorFields)

      try {
        await this.registerAction(this.form)

        this.$router.push({
          name: 'Home',
        })
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errorFields)
        } else {
          this.errorMsg =
            err?.response?.data?.message || 'Failed to register user.'
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
