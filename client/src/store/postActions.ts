import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchTimeline__api } from '../api/postApi';
import { GetPostsDto, PostCommentDto, PostDto } from '../types';
import { postSlice } from './postSlice';
import { postComment__api } from '../api/commentApi';

export const fetchPostsAction = (dto: GetPostsDto): ThunkAction<Promise<PostDto[] | false>, RootState, unknown, AnyAction> => async (dispatch, getState) => {
  try {
    console.log('dto ======')
    console.log(dto);
    const state = getState();
    const postIds = state.post.posts.map((post) => post.id)
    if (postIds.length) {
      dto.notIn = postIds;
    }
    console.log(dto);

    const posts = await fetchTimeline__api(dto);
    if (!posts) return false;
    dispatch(postSlice.actions.setPosts({ posts }));
    return posts;
  } catch (error) {
    console.log('error')
    console.log(error)
    return false;
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
    return false;
  }
}

export const setPageAction = (page: number): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => async (dispatch) => {
  dispatch(postSlice.actions.setPage({ page }));
}

