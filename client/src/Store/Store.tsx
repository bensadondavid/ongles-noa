import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import languageReducer from "./LanguageSlice";
import userReducer from './UsersSlice'
import prestationsReducer from './PrestationSlice'
import optionsReducer from './OptionsSlice'

const rootReducer = combineReducers({
  language: languageReducer,
  user : userReducer,
  prestations : prestationsReducer,
  options : optionsReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["language", "prestations", "options"],
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);