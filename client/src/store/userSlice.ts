import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from './store';
import { UserDto } from '../types';

export enum OnlineStatus {
  Connected = "connected",
  Disconnected = "disconnected",
}
export interface UserState {
  user: UserDto
  friendsStatus: Status[];
}

export interface Status {
  userId: string;
  status: OnlineStatus;
}

// @ts-ignore
const initialState: UserState = { friendsStatus: [] };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<{ dto: UserDto }>) => {
      const dto = action.payload.dto
      state.user.username = dto.username || state.user.username;
      state.user.picture = dto.picture || state.user.picture;
      state.user.email = dto.email || state.user.email;
    },
    setCurrentUser: (state, { payload }) => {
      state.user = { ...state, ...payload };
    },
    logout() {
      return undefined;
    },
    setFriendsStatus: (state, { payload }) => {
      state.friendsStatus = payload;
    },
    setUserStatus: (state, { payload }) => {
      const index = state.friendsStatus.findIndex(
        (status: Status) => status.userId === payload.userId
      );
      state.friendsStatus[index] = payload;
    },
  },
});

export default userSlice.reducer;

export const { setCurrentUser, setFriendsStatus, setUserStatus, logout, setProfile } =
  userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
