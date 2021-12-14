<template>
  <div class="main">
    <div class="container">
      <Checkbox v-model:checked="checked"></Checkbox>
      <div>wefe</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Checkbox from '../components/Checkbox.vue'
export default defineComponent({
  name: 'MainView',
  components: { Checkbox },
  setup() {
    const checked = ref(false)
    return { checked }
  },
})
</script>

<style lang="scss" scoped>
.main {
  align-items: center;
  justify-content: center;
  margin: 1.5rem;
}
.container {
  background: #f6e9e6;
  box-shadow: 10px 12px 0px -1px #ebc2bb;
  border-radius: 20px;
  width: 100px;
  height: 100px;
  width: 100%;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
