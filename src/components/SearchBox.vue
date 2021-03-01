<template>
  <div class="search-box d-flex align-center">
    <v-btn
      v-if="!showSearch"
      rounded
      class="search-box-toggle primary elevation-0"
      @click="showSearch = true"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <transition name="search">
      <v-text-field
        v-if="showSearch"
        v-model="search"
        ref="searchBox"
        dark
        solo
        dense
        rounded
        hide-details
        class="search-box-input"
        background-color="primary"
        placeholder="Search.."
        prepend-inner-icon="mdi-magnify"
        append-icon="mdi-close"
        @click:append="showSearch = false"
      ></v-text-field>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSearch: false,
      search: '',
    }
  },

  watch: {
    showSearch(val) {
      if (val) {
        this.$nextTick(() => this.$refs.searchBox.focus())
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.search-enter-active,
.search-leave-active {
  max-width: 0;
}

.search-enter-active {
  transition: max-width 250ms ease-out;
}

.search-enter-to,
.search-leave {
  max-width: 300px;
}

.search-box {
  .search-box-toggle {
    @media screen and (min-width: 1264px) {
      box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
        0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
    }
  }
}
</style>
