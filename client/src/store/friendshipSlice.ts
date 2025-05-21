import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from './store';
import { CommentDto, FriendshipDto, PostDto, UserDto } from '../types';

export interface FriendshipState {
  friendships: FriendshipDto[],
  possibleFriends: UserDto[],
  possibleFriendsPage: number
}

const initialState: FriendshipState = { friendships: [], possibleFriends: [], possibleFriendsPage: 0 };

export const friendshipSlice = createSlice({
  name: "friendship",
  initialState,
  reducers: {
    setfriendship: (state, action: PayloadAction<{ friendships: FriendshipDto[] | FriendshipDto }>) => {
      const { friendships } = action.payload;
      if (Array.isArray(friendships)) {
        state.friendships = [...state.friendships, ...friendships]
      } else {
        state.friendships = [...state.friendships, friendships]
      }
    },
    setPossibleFriends: (state, action: PayloadAction<{ friends: UserDto[] | UserDto, page: number }>) => {
      const { friends, page } = action.payload;
      console.log('friends')
      console.log(friends);
      console.log(page);
      if (Array.isArray(friends)) {
        state.possibleFriends = page ? [...state.possibleFriends, ...friends] : [...friends]
      } else {
        state.possibleFriends = page ? [...state.possibleFriends, friends] : [friends]
      }
    },
    setPossibleFriendsPage: (state, action: PayloadAction<{ page: number }>) => {
      const { page } = action.payload;
      state.possibleFriendsPage = page;
    },
  }
});

export default friendshipSlice.reducer;

export const selectFriendships = (state: RootState) => state.friendships.friendships;
export const selectPossibleFriends = (state: RootState) => state.friendships.possibleFriends;
export const selectPossibleFriendsPage = (state: RootState) => state.friendships.possibleFriendsPage;
