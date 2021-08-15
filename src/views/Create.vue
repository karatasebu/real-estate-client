<template>
  <div class="create">
    <FormComponent />
    <MapComponent />
  </div>
</template>

<script>
import MapComponent from "@/components/Map.vue";
import FormComponent from "@/components/Form.vue";

export default {
  components: { MapComponent, FormComponent },
};
</script>

<style lang="scss" scoped>
.create {
  display: flex;
  justify-content: space-between;
  padding: 0 50px 0 300px;
}
</style>
