import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import languageReducer from "./LanguageSlice";
import userReducer from './UsersSlice'
import prestationreducer from './PrestationSlice'

const rootReducer = combineReducers({
  language: languageReducer,
  user : userReducer,
  prestation : prestationreducer 
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["language", "prestation"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools : true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);