import { createSlice, current, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from './store';
import { CommentDto, FriendshipDto, FriendshipStatus, PostDto, UserDto } from '../types';

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
    setfriendships: (state, action: PayloadAction<{ friendships: FriendshipDto[] }>) => {
      const { friendships } = action.payload;
      state.friendships = [...friendships]
    },
    upsertfriendship: (state, action: PayloadAction<{ friendship: FriendshipDto }>) => {
      const { friendship } = action.payload;

      const i = state.friendships.findIndex((frShip) => { frShip.id === friendship.id })
      const foundFriendship = i > 0;
      if (foundFriendship) {
        state.friendships[i] = friendship;
      } else {
        state.friendships.push(friendship);
      }
    },
    setPossibleFriends: (state, action: PayloadAction<{ friends: UserDto[] | UserDto, page: number }>) => {
      const { friends, page } = action.payload;
      if (Array.isArray(friends)) {
        state.possibleFriends = page ? [...state.possibleFriends, ...friends] : [...friends]
      } else {
        state.possibleFriends = page ? [...state.possibleFriends, friends] : [friends]
      }
    },
    cleanupPossibleFriends: (state, action: PayloadAction<{ currentUser: UserDto }>) => {
      const { currentUser } = action.payload;

      state.possibleFriends = state.possibleFriends.filter(friend => {
        const users = [friend.id, currentUser.id];
        const friendship = state.friendships.find((fShip) => {
          const usersAreInRelation = users.indexOf(fShip.acceptedBy.id) > -1;
          return usersAreInRelation;
        })
        
        if (!friendship) return true;
        return friendship.status === FriendshipStatus.Requested
      })
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
