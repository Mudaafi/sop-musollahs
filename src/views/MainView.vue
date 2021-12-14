<template>
  <div class="main">
    <div class="container">
      <Checkbox
        v-for="i in fields.length"
        class="form-item"
        :label="fields[i - 1]"
        :initVal="values[i - 1]"
        @changed="sendRequest"
      ></Checkbox>
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
    const fields = ['Floor Swept', 'Floor Swept']
    const values = [true, false]
    const sendRequest = (field: String, newValue: String) =>
      console.log(field, newValue)
    return { sendRequest, fields, values }
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
  width: 100%;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .form-item {
    margin-bottom: 12px;
  }
}
</style>
