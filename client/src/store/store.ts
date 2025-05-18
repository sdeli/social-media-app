import { configureStore } from "@reduxjs/toolkit";
import callSlice from "./callSlice";
import messageSlice from "./messageSlice";
import userSlice from "./userSlice";

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};
const persistedState = loadState();

export const store = configureStore({
  reducer: { user: userSlice, message: messageSlice, call: callSlice },
  preloadedState: persistedState,

});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
