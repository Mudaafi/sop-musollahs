import { ActionType, GetterType, MutationType } from '../types'
import { GetDataParams, PostDataParams } from '../../../functions/lib/types'
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex'
import api from '../../api'
import { State as RootState } from '../index'
import { map } from 'lodash-es'

export type State = {
  fields: Array<string>
  values: Array<any>
  areas: Array<string>
}

const state = {
  fields: [],
  values: [],
  areas: [],
} as State

const getters: GetterTree<State, RootState> = {
  [GetterType.FIELDS]: (state: State): Array<string> => {
    return state.fields
  },
  [GetterType.AREAS]: (state: State): Array<string> => {
    return state.areas
  },
  [GetterType.AREA_OPTIONS]: (
    state: State,
  ): Array<{ value: string; label: string }> => {
    return map(state.areas).map((area: string) => {
      return { value: area, label: area }
    })
  },
  [GetterType.CHECKBOX_FIELDS]: (state: State): Array<string> => {
    var fields = []
    for (var i = 0; i < state.fields.length; ++i) {
      if (
        state.fields[i].endsWith('?') &&
        (state.values[i] == 'FALSE' ||
          state.values[i] == 'TRUE' ||
          state.values[i] == true ||
          state.values[i] == false)
      )
        fields.push(state.fields[i])
    }
    return fields
  },
  [GetterType.CHECKBOX_VALUES]: (state: State): Array<any> => {
    var values = []
    for (var i = 0; i < state.fields.length; ++i) {
      if (
        state.fields[i].endsWith('?') &&
        (state.values[i] == 'FALSE' ||
          state.values[i] == 'TRUE' ||
          state.values[i] == true ||
          state.values[i] == false)
      )
        values.push(state.values[i] == 'FALSE' ? false : true)
    }
    return values
  },
  [GetterType.VALUES]: (state: State): Array<any> => {
    return state.values
  },
  [GetterType.INPUT_FIELDS]: (state: State): Array<string> => {
    var fields = []
    for (var i = 0; i < state.fields.length; ++i) {
      if (state.fields[i].endsWith('~')) fields.push(state.fields[i])
    }
    return fields
  },
  [GetterType.INPUT_VALUES]: (state: State): Array<string> => {
    var values = []
    for (var i = 0; i < state.fields.length; ++i) {
      if (state.fields[i].endsWith('~')) values.push(state.values[i])
    }
    return values
  },
}

const actions: ActionTree<State, RootState> = {
  [ActionType.FETCH_FIELDS]: async ({
    commit,
  }: ActionContext<State, RootState>) => {
    const fields = (
      await api.get('', {
        params: {
          function: 'fields',
        } as GetDataParams,
      })
    ).data
    commit(MutationType.UPDATE_FIELDS, fields)
  },
  [ActionType.FETCH_VALUES]: async (
    { commit }: ActionContext<State, RootState>,
    { area }: { area: string },
  ) => {
    const values = (
      await api.get('', {
        params: {
          function: 'values',
          area: area,
        } as GetDataParams,
      })
    ).data
    commit(MutationType.UPDATE_VALUES, values)
  },
  [ActionType.FETCH_AREAS]: async ({
    commit,
  }: ActionContext<State, RootState>) => {
    const areas = (
      await api.get('', {
        params: {
          function: 'areas',
        } as GetDataParams,
      })
    ).data
    commit(MutationType.UPDATE_AREAS, areas)
  },
  [ActionType.SEND_VALUE]: async (
    { commit }: ActionContext<State, RootState>,
    { field, area, value }: { field: string; area: string; value: any },
  ) => {
    const params: PostDataParams = {
      function: 'update',
      area: area,
      field: field,
      data: value,
    }
    await api.post('', params)
  },
  [ActionType.CLEAR]: ({ commit }: ActionContext<State, RootState>) => {
    commit(MutationType.CLEAR)
  },
}

const mutations: MutationTree<State> = {
  [MutationType.UPDATE_FIELDS]: (state: State, fields: Array<string>) => {
    state.fields = fields
  },
  [MutationType.UPDATE_VALUES]: (state: State, values: Array<any>) => {
    state.values = values
  },
  [MutationType.UPDATE_AREAS]: (state: State, areas: Array<string>) => {
    state.areas = areas
  },
  [MutationType.UPDATE_VALUE]: (
    state: State,
    updateParam: { field: string; value: any },
  ) => {
    let index = state.fields.indexOf(updateParam.field)
    state.values[index] = updateParam.value
  },
  [MutationType.CLEAR]: (state: State, areas: Array<string>) => {
    state.values = []
    state.fields = []
  },
}

const googleapi: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
}

export default googleapi
