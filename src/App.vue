<template>
  <main>
    <NavComponent />
    <router-view :key="route.path" />
  </main>
</template>

<script>
import { useRoute } from "vue-router";

import NavComponent from "@/components/Nav.vue";

export default {
  components: { NavComponent },
  setup() {
    const route = useRoute();

    return {
      route,
    };
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/base/base";
</style>
