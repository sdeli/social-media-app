import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from './store';
import { UserDto } from '../types';

export enum OnlineStatus {
  Connected = "connected",
  Disconnected = "disconnected",
}
interface User {
  id: string;
  name: string;
  picture: string;
  email: string;
  friendsStatus: Status[];
}

export interface Status {
  userId: string;
  status: OnlineStatus;
}

// @ts-ignore
const initialState: User = { friendsStatus: [] };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<{ dto: UserDto }>) => {
      const dto = action.payload.dto
      return {
        ...state,
        name: dto.name || '',
        picture: dto.picture || state.picture
      };
    },
    setCurrentUser: (state, { payload }) => {
      return { ...state, ...payload };
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

export const selectUser = (state: RootState) => state.user;
