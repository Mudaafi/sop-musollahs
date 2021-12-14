<template>
  <img class="bg" src="./assets/background.svg" alt="" />
  <div class="content">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100vh;
}
body {
  margin: 0;
}
.bg {
  height: 100%;
  width: 100%;
  object-fit: fill;
  position: fixed;
}
.content {
  position: absolute;
  align-items: center;
  text-align: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  width: 100vw;
}
</style>
