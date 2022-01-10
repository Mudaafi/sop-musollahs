<template>
  <div class="box" :class="{ 'is-submitted': submitted }">
    <div class="input-label">{{ label.slice(0, -1) }}</div>
    <NInput
      class="ninput"
      v-model:value="text"
      :default-value="text"
      type="textarea"
      @input="submitRequest"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NInput } from 'naive-ui'
import debounce from 'lodash.debounce'
import { ActionType } from '../store/types'

export default defineComponent({
  name: 'Input',
  components: {
    NInput,
  },
  props: {
    initVal: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      text: this.initVal,
      submitted: true,
    }
  },
  watch: {
    initVal() {
      this.text = this.initVal
    },
  },
  methods: {
    submitRequest() {
      this.submitted = false
      this.$emit('updating', true)
      this.submit()
    },
    submit: debounce(async function debounceSubmit(this: any) {
      await this.$store.dispatch(ActionType.SEND_VALUE, {
        field: this.label,
        area: this.area,
        value: this.text,
      })
      this.submitted = true
      this.$emit('updating', false)
    }, 2000),
  },
})
</script>

<style lang="scss" scoped>
.box {
  // Default style when unchecked
  background: $white;
  border-radius: 12px;
  width: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .input-label {
    color: $primary-5;
    font-size: 25px;
    text-align: left;
    background-color: transparent;
  }
  .ninput {
    text-align: left;
    background-color: transparent;
    border: none;
  }
  &.is-submitted {
    background-color: $success-light;
  }
}

.input-submitted {
  background-color: $success-light;
}
</style>
