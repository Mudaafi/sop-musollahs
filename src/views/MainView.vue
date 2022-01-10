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
        :initVal="inputs[i - 1] == undefined ? '' : inputs[i - 1]"
        @updating="updated = !$event"
      />
      <div class="form-item note-header" v-if="notes.length > 0">
        Take Note!
      </div>
      <div v-for="note in notes" class="form-item note-item">{{ note }}</div>
      <div class="submit">
        <NInput
          placeholder="Telegram Username"
          class="username"
          :class="{
            'is-updated': updated,
          }"
          v-model:value="username"
          :default-value="username"
          @input="updateUsername"
        >
          <template #prefix>@</template>
        </NInput>
        <NButton
          color="#cfffb9"
          :disabled="!updated"
          type="success"
          class="button"
          @click="updateTele"
          >Update Telegram Group</NButton
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Checkbox from '../components/Checkbox.vue'
import Input from '../components/Input.vue'
import { ActionType, GetterType } from '../store/types'
import { mapGetters } from 'vuex'
import { NSelect, NInput, NButton } from 'naive-ui'
import debounce from 'lodash.debounce'

export default defineComponent({
  name: 'MainView',
  components: { Checkbox, NSelect, Input, NInput, NButton },
  props: {
    area: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedArea: this.area,
      updated: false,
      username: '',
    }
  },
  computed: {
    ...mapGetters({
      fields: GetterType.CHECKBOX_FIELDS,
      values: GetterType.CHECKBOX_VALUES,
      inputFields: GetterType.INPUT_FIELDS,
      inputs: GetterType.INPUT_VALUES,
      storedUsername: GetterType.TELE_USERNAME,
      notes: GetterType.NOTES,
    }),
    areas(): Array<{ value: string; label: string }> {
      return this.$store.getters[GetterType.AREA_OPTIONS]
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
    updateTele: debounce(async function debounceTeleUpdate(this: any) {
      // Toast probably

      await this.$store.dispatch(ActionType.TELE_UPDATE_TELEGRAM, {
        area: this.area,
        checkboxFields: this.fields,
        checkboxValues: this.values,
        inputFields: this.inputFields,
        inputValues: this.inputs,
        username: this.username,
      })
    }, 1000),
    updateUsername: debounce(function debounceUpdateUsername(this: any) {
      this.updated = false
      this.$store.dispatch(ActionType.TELE_RECORD_USERNAME, {
        username: this.username,
      })
      this.updated = this.username.length > 0
    }, 1000),
  },
  async mounted() {
    this.username = this.storedUsername != null ? this.storedUsername : ''
    this.updated = this.username.length > 0
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
    font-weight: bold;
    &.note-header {
      margin-bottom: 12px;

      color: $primary-5;
      font-size: 25px;
      line-height: 32px;
      margin-top: 12px;
    }
    &.note-item {
      width: 75%;
      text-align: left;
      color: black;
    }
  }
  .area-select {
    color: $primary-5;
    font-size: 25px;
  }
  .submit {
    display: flex;
    flex-direction: column;
    align-items: center;
    .username {
      display: block;
      margin-bottom: 10px;
      border-radius: 12px;
    }
    .button {
      font-size: 18px;
      border-radius: 12px;
      color: $primary-5;
      border: 2px solid $success;
      //background-color: $success-light;
    }
    .is-updated {
      background-color: $success-light;
    }
  }
}
</style>
