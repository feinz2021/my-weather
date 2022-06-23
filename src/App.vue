<template>
  <WeatherPage />
</template>

<script>
import WeatherPage from "./components/WeatherPage.vue";

export default {
  name: "App",
  components: {
    WeatherPage,
  },
};
</script>

<style>
body {
  background-image: linear-gradient(to bottom right, #80cbc4, #e0f2f1);
  height: 100vh;
}
</style>
