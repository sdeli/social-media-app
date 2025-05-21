import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchTimeline__api } from '../api/postApi';
import { AcceptFriendsRequestsDto, FriendshipDto, GetFriendsRequestsDto, GetPossibleFriendsDto, GetPostsDto, PostCommentDto, PostDto, SendFriendshipRequestDto, UserDto } from '../types';
import { friendshipSlice } from './friendshipSlice';
import { postComment__api } from '../api/commentApi';
import { acceptFriendshipRequests__api, getAllFriendships__api, getPossibleFriends__api, sendFriendRequest__api } from '../api/friendshipApi';

export const fetchPossibleFriendsAction = (dto: GetPossibleFriendsDto): ThunkAction<Promise<UserDto[] | false>, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
    // dispatch(wordSlice.actions.setFetchingWords(true));
    const friends = await getPossibleFriends__api(dto);
    if (!friends) return false;
    dispatch(friendshipSlice.actions.setPossibleFriends({ friends, page: dto.page }));
    return friends;
  } catch (error) {
    console.log('error')
    console.log(error)
    return false;
  }
}

export const sendFriendRequestAction = (dto: SendFriendshipRequestDto): ThunkAction<Promise<FriendshipDto | false>, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
    // dispatch(wordSlice.actions.setFetchingWords(true));
    const friendship = await sendFriendRequest__api(dto);
    if (!friendship) return false;
    dispatch(friendshipSlice.actions.upsertfriendship({ friendship }));
    return friendship;
  } catch (error) {
    console.log('error')
    console.log(error)
    return false;
  }
}

export const getAllFriendShipsAction = (dto: GetFriendsRequestsDto): ThunkAction<Promise<FriendshipDto[] | false>, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
    const friendships = await getAllFriendships__api(dto);
    if (!friendships) return false;
    dispatch(friendshipSlice.actions.setfriendships({ friendships }));
    console.log('friendships')
    console.log(friendships);
    return friendships;
  } catch (error) {
    console.log('error')
    console.log(error)
    return false;
  }
}

export const acceptFriendshipRequestsAction = (dto: AcceptFriendsRequestsDto): ThunkAction<Promise<FriendshipDto | false>, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
    const friendship = await acceptFriendshipRequests__api(dto);
    if (!friendship) return false;
    dispatch(friendshipSlice.actions.upsertfriendship({ friendship }));
    return friendship;
  } catch (error) {
    console.log('error')
    console.log(error)
    return false;
  }
}

export const setPossibleFriendsPageAction = (page: number): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch) => {
  dispatch(friendshipSlice.actions.setPossibleFriendsPage({ page }));
}

export const cleanupPossibleFriendsAction = (currentUser: UserDto): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch) => {
  dispatch(friendshipSlice.actions.cleanupPossibleFriends({ currentUser }));
}
