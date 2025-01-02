import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

import { profileApi } from '@/features/profile/api/profileApi'
import AuthReducer from '@/features/auth/stores/authStore'
import { profileFormStore } from '@/features/profile/store/profileFormStore'

const persistAuthConfig = {
  key: "auth",
  storage,
}

const rootReducer = combineReducers({
  auth: persistReducer(persistAuthConfig, AuthReducer),
  [profileApi.reducerPath]: profileApi.reducer,
  profileForm: profileFormStore.reducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(profileApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
