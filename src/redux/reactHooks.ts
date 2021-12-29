import {
  TypedUseSelectorHook,
  useDispatch as useDispatchRR,
  useSelector as useSelectorRR
} from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => useDispatchRR<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRR
