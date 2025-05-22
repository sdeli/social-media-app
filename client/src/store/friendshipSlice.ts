import { createSlice, current, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from './store';
import { CommentDto, FriendshipDto, FriendshipStatus, PostDto, UserDto } from '../types';

export interface FriendshipState {
  friendships: FriendshipDto[],
  possibleFriends: UserDto[],
  friendsQuery: string,
  possibleFriendsQuery: string,
}

const initialState: FriendshipState = { friendships: [], possibleFriends: [], friendsQuery: '', possibleFriendsQuery: '' };

export const friendshipSlice = createSlice({
  name: "friendship",
  initialState,
  reducers: {
    setfriendsQuery: (state, action: PayloadAction<{ query: string }>) => {
      const { query } = action.payload;
      state.friendsQuery = query;
    },
    setPossiblefriendsQuery: (state, action: PayloadAction<{ query: string }>) => {
      const { query } = action.payload;
      state.possibleFriendsQuery = query;
    },
    setfriendships: (state, action: PayloadAction<{ friendships: FriendshipDto[] }>) => {
      const { friendships } = action.payload;
      state.friendships = [...friendships]
    },
    upsertfriendship: (state, action: PayloadAction<{ friendship: FriendshipDto }>) => {
      const { friendship } = action.payload;

      const i = state.friendships.findIndex((frShip) => {
        return frShip.id === friendship.id
      })

      const foundFriendship = i > -1;
      if (foundFriendship) {
        state.friendships[i] = friendship;
      } else {
        state.friendships.push(friendship);
      }
    },
    setPossibleFriends: (state, action: PayloadAction<{ friends: UserDto[] }>) => {
      const { friends } = action.payload;
      state.possibleFriends = [...state.possibleFriends, ...friends]
    },
    cleanupPossibleFriends: (state, action: PayloadAction<{ currentUser: UserDto }>) => {
      const { currentUser } = action.payload;
      state.possibleFriends = state.possibleFriends.filter(friend => {
        const friendship = state.friendships.find((fShip) => {
          return fShip.acceptedBy.id === friend.id || fShip.requestedBy.id === friend.id
        })

        if (!friendship) return true;
        return friendship.status === FriendshipStatus.Requested
      })
      console.log(state.possibleFriends.length);
    },
  }
});

export default friendshipSlice.reducer;

export const selectFriendships = (state: RootState) => state.friendships.friendships;
export const selectPossibleFriends = (state: RootState) => state.friendships.possibleFriends;
export const selectFriendsQuery = (state: RootState) => state.friendships.friendsQuery;
export const selectPossibleFriendsQuery = (state: RootState) => state.friendships.possibleFriendsQuery;
