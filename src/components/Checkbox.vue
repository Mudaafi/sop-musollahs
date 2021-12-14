<template>
  <div
    class="box"
    @click="$emit('update:checked', !checked)"
    :class="{ 'is-checked': checked }"
  >
    <div class="checkbox">
      <img src="@/assets/tick.svg" alt="tick" class="checkbox-true" />
    </div>

    <div></div>
    <div class="checkbox-label">Floor Swept</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NCheckbox } from 'naive-ui'

export default defineComponent({
  name: 'Checkbox',
  components: {
    NCheckbox,
  },
  props: {
    checked: {
      type: Boolean,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.box {
  // Default style when unchecked
  background: #fefefe;
  border-radius: 12px;
  width: 85%;
  height: 25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  .checkbox {
    margin: 0 12px 0 20px;
    border: 2px dashed #8e441b;
    box-sizing: border-box;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    position: relative;
    .checkbox-true {
      position: absolute;
      left: 0;
      top: 0;
      width: 25px;
      height: 25px;
      opacity: 0;
    }
  }
  .checkbox-label {
    color: $primary-5;
    font-size: 25px;
  }

  // Styles to apply when checked
  &.is-checked {
    background: $success-light;
    border: 2px solid $success;
    border-radius: 12px;
    .checkbox {
      border: none;
      .checkbox-true {
        opacity: 1;
      }
    }
    .checkbox-label {
      color: $success;
    }
  }
}
</style>
