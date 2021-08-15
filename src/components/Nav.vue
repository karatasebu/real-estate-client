<template>
  <nav class="nav">
    <router-link to="/" class="nav__link"
      ><img class="nav__logo" src="@/assets/img/logo.png" alt="logo"
    /></router-link>
    <button @click="createAppointment" class="nav__btn">
      <img src="@/assets/svg/plus.svg" alt="plus-icon" />
      <span>Create Appointment</span>
    </button>
    <router-link to="/" class="nav__link">Home</router-link>
    <router-link to="/appointments" class="nav__link">Appointments</router-link>
  </nav>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    function createAppointment() {
      router.push("/create");
    }
    return {
      createAppointment,
    };
  },
};
</script>

<style lang="scss">
.nav {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: $dark-color;
  width: 250px;
  padding: 20px;
  border-radius: 0 30px 30px 0;
  &__logo {
    width: 150px;
    margin: auto;
  }
  &__link {
    text-decoration: none;
    color: rgb(173, 168, 168);
    padding: 15px;
  }
  &__btn {
    background: $dark-color;
    color: $light-color;
    padding: 10px 15px;
    border: 2px solid $light-color;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    @include font-size(16);
    cursor: pointer;
    &:active {
      transform: scale(0.98);
    }
  }
}
.router-link-active {
  color: $light-color;
}
</style>
