<template>
  <v-card flat id="settings-page">
    <v-card-text>
      <div class="d-flex justify-space-between align-center">
        <div class="setting-item">
          <v-icon class="setting-icon">mdi-trash-can</v-icon>
          <span class="setting-text">Trash</span>
        </div>

        <v-switch v-model="settings.trash" hide-details class="mt-0"></v-switch>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SettingsPage',

  data() {
    return {
      init: true,
      settings: {
        trash: null,
      },
    }
  },

  computed: {
    ...mapState('auth', {
      userState: state => state.user,
    }),
    userSettings() {
      return this.userState.settings
    },
  },

  watch: {
    settings: {
      deep: true,
      handler() {
        if (!this.init) {
          this.syncUserSettings()
        }
      },
    },
    userSettings: {
      deep: true,
      immediate: true,
      handler() {
        this.syncUserSettingsState()
      },
    },
  },

  methods: {
    ...mapActions('auth', {
      updateUserSettings: 'updateUserSettings',
    }),
    syncUserSettingsState() {
      for (const key in this.userSettings) {
        this.settings[key] = this.userSettings[key] === 'enable' ? true : false
      }

      if (this.init) {
        this.$nextTick(() => (this.init = false))
      }

      return this.settings
    },
    getPayload() {
      const payload = {}
      for (const key in this.settings) {
        payload[key] = this.settings[key] === true ? 'enable' : 'disable'
      }

      return payload
    },
    async syncUserSettings() {
      this.$overlay.show('Updating...')

      try {
        await this.updateUserSettings(this.getPayload())
      } catch (err) {
        this.$snackbar.show({
          color: 'red',
          text: err?.response?.data?.message || 'Failed to save user settings.',
        })
      } finally {
        this.$overlay.hide()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#settings-page {
  max-width: 768px;

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: center;

    .setting-text {
      margin-left: 0.25rem;
    }
  }
}
</style>
