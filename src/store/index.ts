import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import googleapi, { State as googleapiState } from './modules/googleapi'
import teleapi, { State as teleapiState } from './modules/teleapi'

export type State = {
  googleapi: googleapiState
  teleapi: teleapiState
}

const store = createStore({
  modules: {
    googleapi,
    teleapi,
  },
  plugins: [createPersistedState()],
})

export default store
