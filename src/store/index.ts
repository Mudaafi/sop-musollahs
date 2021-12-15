import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import googleapi, { State as googleapiState } from './modules/googleapi'

export type State = {
  googleapi: googleapiState
}

const store = createStore({
  modules: {
    googleapi,
  },
  plugins: [createPersistedState()],
})

export default store
