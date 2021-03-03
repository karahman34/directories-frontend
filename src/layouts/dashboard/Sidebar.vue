<template>
  <v-navigation-drawer v-model="show" app dark class="py-2 blue-grey darken-4">
    <!-- Logo -->
    <v-app-bar-title class="d-flex justify-center py-2">
      <logo class="white--text text-h5"></logo>
    </v-app-bar-title>

    <!-- List of menus -->
    <v-list dense nav>
      <v-list-item
        v-for="menu in menus"
        :key="menu.title"
        link
        exact
        :to="menu.to"
      >
        <v-list-item-icon>
          <v-icon>{{ menu.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ menu.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Logo from '@/components/Logo'

export default {
  model: {
    prop: 'value',
    event: 'change',
  },

  components: {
    Logo,
  },

  props: {
    menus: {
      type: Array,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      show: null,
    }
  },

  watch: {
    value(val) {
      this.show = val
    },
    show: {
      immediate: true,
      handler(val) {
        this.$emit('change', val)
      },
    },
  },
}
</script>
