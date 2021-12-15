<template>
  <div class="main">
    <div class="container">
      <NSelect
        class="form-item area-select"
        :options="areas"
        v-model:value="selectedArea"
        @update:value="getArea"
      />
      <Checkbox
        v-for="i in fields.length"
        class="form-item"
        :label="fields[i - 1]"
        :initVal="values[i - 1]"
        @changed="sendRequest"
      ></Checkbox>
      <Input
        v-for="i in inputFields.length"
        class="form-item"
        :area="area"
        :label="inputFields[i - 1]"
        :initVal="inputs[i - 1]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Checkbox from '../components/Checkbox.vue'
import Input from '../components/Input.vue'
import { ActionType, GetterType } from '../store/types'
import { mapGetters } from 'vuex'
import { NSelect } from 'naive-ui'
type NSelectOption = { value: string; label: string }

export default defineComponent({
  name: 'MainView',
  components: { Checkbox, NSelect, Input },
  props: {
    area: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedArea: this.area,
    }
  },
  computed: {
    ...mapGetters({
      fields: GetterType.CHECKBOX_FIELDS,
      values: GetterType.CHECKBOX_VALUES,
      inputFields: GetterType.INPUT_FIELDS,
      inputs: GetterType.INPUT_VALUES,
    }),
    areas(): Array<NSelectOption> {
      return this.$store.getters[GetterType.AREAS].map((area: string) => {
        return { value: area, label: area } as NSelectOption
      })
    },
  },
  methods: {
    async getArea() {
      this.$store.dispatch(ActionType.CLEAR)
      this.$router.replace({
        name: 'Main',
        params: { area: this.selectedArea },
      })
      await this.$store.dispatch(ActionType.FETCH_FIELDS)
      await this.$store.dispatch(ActionType.FETCH_VALUES, { area: this.area })
    },
    sendRequest(field: string, value: any) {
      this.$store.dispatch(ActionType.SEND_VALUE, {
        area: this.area,
        field: field,
        value: value,
      })
    },
  },
  async mounted() {
    await this.$store.dispatch(ActionType.FETCH_AREAS)
    await this.$store.dispatch(ActionType.FETCH_FIELDS)
    await this.$store.dispatch(ActionType.FETCH_VALUES, { area: this.area })
  },
})
</script>

<style lang="scss" scoped>
.main {
  align-items: center;
  justify-content: center;
  margin: 1.8rem;
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
    margin-bottom: 16px;
  }
  .area-select {
    color: $primary-5;
    font-size: 25px;
  }
}
</style>
