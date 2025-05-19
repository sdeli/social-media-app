import { configureStore } from "@reduxjs/toolkit";
import callSlice, { CallState } from "./callSlice";
import messageSlice, { MessageState } from "./messageSlice";
import userSlice, { UserState } from "./userSlice";
import postSlice, { PostState } from "./postSlice";

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

interface AppState {
  user: UserState,
  message: MessageState,
  call: CallState,
  post: PostState,
}

export const store = configureStore<AppState>({
  reducer: { user: userSlice, message: messageSlice, call: callSlice, post: postSlice },
  preloadedState: persistedState,

});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
