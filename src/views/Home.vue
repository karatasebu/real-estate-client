<template>
  <div class="home">
    <h1 class="home__title">Welcome to Iceberg Real Estate Dashboard</h1>
    <p class="home__text">
      You can create appointment by clicking Create Appointment button in the
      menu and also you can view and manage appointments with going to
      Appointments tab.
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.home {
  margin: 50px 50px 50px 300px;
  text-align: center;
  &__title {
    @include font-size(44);
  }
  &__text {
    @include font-size(20);
  }
}
</style>
