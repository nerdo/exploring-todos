import { getNextId } from './getNextId'
import { IListItem } from './types'

export const defaultListItems: IListItem[] = [
  {
    id: getNextId(),
    label: 'Buy milk'
  },
  {
    id: getNextId(),
    label: 'Buy eggs'
  },
  {
    id: getNextId(),
    label: 'Buy cheese',
    completed: true
  },
  {
    id: getNextId(),
    label: 'Buy bread'
  }
]

export interface IDefaults {
  defaultListItems: IListItem[]
}

export const getCopyOfDefaults = (): IDefaults => JSON.parse(JSON.stringify({ defaultListItems }))
