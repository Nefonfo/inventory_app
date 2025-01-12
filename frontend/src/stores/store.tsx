import storage from "redux-persist/lib/storage"
import { persistStore, persistReducer } from "redux-persist"
import { combineReducers, configureStore } from "@reduxjs/toolkit"

import { authApi } from "@/features/auth/api"
import { profileApi } from "@/features/profile/api"
import { reducer as AuthReducer } from "@/features/auth/stores"
import { profileFormStore } from "@/features/profile/store"

const persistAuthConfig = {
  key: "auth",
  storage,
}

const rootReducer = combineReducers({
  auth: persistReducer(persistAuthConfig, AuthReducer),
  [profileApi.reducerPath]: profileApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  profileForm: profileFormStore.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware, profileApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
