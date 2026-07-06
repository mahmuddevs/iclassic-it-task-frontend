import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'
import authReducer, { setUser } from './slices/auth-slice'
import { setIsGuest, setSessionExpiredCallback } from '../utils/getFetch'

const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  })
}

export const store = makeStore()

// Infer the type of makeStore
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// Typed hooks to use throughout the app instead of plain useDispatch and useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

// Subscribe to state changes of isGuest
let currentIsGuest = store.getState().auth.isGuest;
store.subscribe(() => {
  const previousIsGuest = currentIsGuest;
  currentIsGuest = store.getState().auth.isGuest;
  if (previousIsGuest !== currentIsGuest) {
    setIsGuest(currentIsGuest);
  }
});

// Set session expired callback
setSessionExpiredCallback(() => {
  store.dispatch(setUser(null));
});

