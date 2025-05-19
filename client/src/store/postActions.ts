import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchTimeline__api } from '../api/postApi';
import { GetCommentsDto, GetPostsDto, PostCommentDto } from '../types';
import { postSlice } from './postSlice';
import { postComment__api } from '../api/commentApi';

export const fetchPostsAction = (dto: GetPostsDto): ThunkAction<Promise<void | false>, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
    // dispatch(wordSlice.actions.setFetchingWords(true));
    const posts = await fetchTimeline__api(dto);
    if (!posts) return false;
    dispatch(postSlice.actions.setPosts({ posts }));
  } catch (error) {
    console.log('error')
    console.log(error)
  }
}

export const addCommentAction = (dto: PostCommentDto): ThunkAction<Promise<void | false>, RootState, unknown, AnyAction> => async (dispatch) => {
  try {
    // dispatch(wordSlice.actions.setFetchingWords(true));
    const comment = await postComment__api(dto);
    if (!comment) return false;
    dispatch(postSlice.actions.addComment({ comment, postId: dto.postId }));
  } catch (error) {
    console.log('error')
    console.log(error)
  }
}
