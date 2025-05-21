import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchTimeline__api } from '../api/postApi';
import { GetPossibleFriendsDto, GetPostsDto, PostCommentDto, PostDto, UserDto } from '../types';
import { friendshipSlice } from './friendshipSlice';
import { postComment__api } from '../api/commentApi';
import { getPossibleFriends__api } from '../api/friendshipApi';

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

export const setPossibleFriendsPageAction = (page: number): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch) => {
  dispatch(friendshipSlice.actions.setPossibleFriendsPage({ page }));
}
