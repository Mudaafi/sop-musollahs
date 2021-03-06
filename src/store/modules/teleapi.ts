import { ActionType, GetterType, MutationType } from '../types'
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex'
import api from '../../api'
import { State as RootState } from '../index'
import { GetDataParams, TeleApiParams } from '../../../functions/lib/types'

export type State = {
  username: string
}

const state = {
  username: '',
} as State

const getters: GetterTree<State, RootState> = {
  [GetterType.TELE_USERNAME]: (state: State): string => {
    return state.username
  },
}

const actions: ActionTree<State, RootState> = {
  [ActionType.TELE_UPDATE_TELEGRAM]: async (
    { commit }: ActionContext<State, RootState>,
    {
      area,
      checkboxFields,
      checkboxValues,
      inputFields,
      inputValues,
      username,
    }: {
      area: string
      checkboxFields: Array<string>
      checkboxValues: Array<boolean>
      inputFields: Array<string>
      inputValues: Array<string>
      username: string
    },
  ) => {
    const groupId = (
      await api.get('/.netlify/functions/googleapi', {
        params: {
          function: 'telegroup',
          area: area,
        } as GetDataParams,
      })
    ).data
    let today = new Date()
    let todayDate = `${today.getDate()} ${today.toLocaleString('default', {
      month: 'short',
    })}`
    let msg = `<b>${area}</b>\n\nChecked by: @${username}\nDate checked: ${todayDate}\n`
    for (var i = 0; i < checkboxFields.length; ++i)
      msg = msg + `${checkboxFields[i]}: ${checkboxValues[i] ? '✅' : '❌'}\n`
    for (var i = 0; i < inputFields.length; ++i)
      msg = msg += `${inputFields[i]}: ${
        inputValues[i] != null ? inputValues[i] : 'NIL'
      }\n\n`
    await api.post('/.netlify/functions/teleapi', {
      groupId: groupId,
      message: msg,
    } as TeleApiParams)
  },
  [ActionType.TELE_RECORD_USERNAME]: async (
    { commit }: ActionContext<State, RootState>,
    { username }: { username: string },
  ) => {
    commit(MutationType.TELE_UPDATE_USERNAME, username)
  },
}

const mutations: MutationTree<State> = {
  [MutationType.TELE_UPDATE_USERNAME]: (state: State, username: string) => {
    if (username == null) return
    state.username = username.length > 0 ? username : ''
  },
}

const googleapi: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
}

export default googleapi
