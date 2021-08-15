<template>
  <div class="home">
    <div class="home__content">
      <h1 class="home__title">
        Mark Burgess founded Iceberg Digital to help Estate Agents work smarter,
        not harder .
      </h1>
      <p class="home__text">
        Mark is the author of the book “Where did my industry go?” which is all
        about the future of business and estate agency. The book was an Amazon
        best seller in 4 different categories. Mark is a regular speaker, both
        Nationally and Internationally at various high profile events, has a TV
        show on Sky and was recently featured on Forbes.com as one of the
        entrepreneurs in the world currently making a real difference.
      </p>
    </div>
    <iframe
      class="home__video"
      src="https://www.youtube.com/embed/kN1t_uUrjiA"
      frameborder="2"
    ></iframe>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.home {
  background: url(https://www.iceberg-digital.co.uk/assets/images/mark-burgess.png);
  background-color: $dark-color;
  color: $light-color;
  padding-inline: 350px 100px;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__content {
    max-width: 500px;
  }
  &__title {
    @include font-size(32);
  }
  &__text {
    @include font-size(16);
    margin-top: 20px;
  }
  &__video {
    width: 530px;
    height: 300px;
  }
}
</style>
