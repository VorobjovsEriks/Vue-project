<template>
  <div class="spinner">
    <span class="spinner-inner-1"></span>
    <span class="spinner-inner-2"></span>
    <span class="spinner-inner-3"></span>
  </div>
</template>

<style lang="scss">
@import "../assets/style/_variables.scss";

.spinner {
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-top: 2px solid $loading-blue;
  border-right: 2px solid transparent;
  animation: spinner .6s linear infinite;
  margin: auto;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
