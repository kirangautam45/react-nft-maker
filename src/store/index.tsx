import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { setupHttpClient } from '@/services/httpClient';

import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'nftDetails'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger);
  },
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

// const dispatch = store.dispatch;
const onUnauthorizedCallback = () => {
  // Logout not implemented yet
  // dispatch('auth/logout');
};

persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState();
  if (bootstrapped) {
    // Set up the http client upon rehydrating the persisted store.
    setupHttpClient(store, onUnauthorizedCallback);
  }
});

let currentToken: string | null;

store.subscribe(() => {
  const prevToken = currentToken;
  if (store.getState().auth.token) {
    currentToken = store.getState().auth.token;

    if (prevToken !== currentToken) {
      // Set up the http client upon the auth session update.
      setupHttpClient(store, onUnauthorizedCallback);
    }
  }
});

export default store;
