import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCopyOfDefaults } from '../defaults'
import { IListItem } from "../types"

const { defaultListItems } = getCopyOfDefaults()

const todoSlice = createSlice({
  name: 'todo',
  initialState: [...defaultListItems],
  reducers: {
    addItems: (state, action: PayloadAction<IListItem[]>) => {
      return state.concat(action.payload)
    },
    editItems: (state, action: PayloadAction<IListItem[]>) => {
      action.payload
        .map((item) => ({ index: state.findIndex((i) => i.id === item.id), item }))
        .forEach(({ index, item }) => (state[index] = item))
    },
    deleteItems: (state, action: PayloadAction<IListItem['id'][]>) => {
      return state.filter((item) => !action.payload.includes(item.id))
    }
  }
})

export const todoReducer = todoSlice.reducer

export const actions = todoSlice.actions

export const { addItems, editItems, deleteItems } = actions

export default actions
