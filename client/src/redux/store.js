import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import themeReducer from "./theme/themeSlice.js";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage, // Use localStorage for persistence
  version: 1, // Versioning for the persisted state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  //   reducer: {
  //     user: userReducer,
  //   },
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
