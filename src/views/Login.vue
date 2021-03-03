<template>
  <div>
    <v-alert v-if="errorMsg" class="auth-card mb-4 rounded-lg" type="error">
      {{ errorMsg }}
    </v-alert>

    <v-card class="auth-card rounded-lg">
      <v-card-title class="text-center">
        <logo class="text-h5"></logo>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="goLogin">
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

          <!-- Footer -->
          <div class="d-flex justify-space-between align-center">
            <router-link :to="{ name: 'Register' }"
              >Don't have an account ?</router-link
            >

            <v-btn type="submit" color="primary" :loading="loading"
              >Login</v-btn
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
    form: {
      email: null,
      password: null,
    },
    errorFields: {
      email: null,
      password: null,
    },
  }),

  methods: {
    ...mapActions('auth', {
      loginAction: 'login',
    }),
    async goLogin() {
      this.loading = true
      this.errorMsg = null
      hideValidationErrors(this.errorFields)

      try {
        await this.loginAction(this.form)

        this.$router.push({
          name: 'Dashboard',
        })
      } catch (err) {
        const errCode = err?.response?.status

        if (errCode === 422) {
          showValidationErrors(err.response.data.data, this.errorFields)
        } else {
          this.errorMsg =
            err?.response?.data?.message || 'Failed to authenticate user.'
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
