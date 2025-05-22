import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './store';
import { CommentDto, PostDto } from '../types';

export interface PostState {
  posts: PostDto[],
  page: number
}

const initialState: PostState = { posts: [], page: 0 };

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<{ posts: PostDto[] | PostDto }>) => {
      const { posts } = action.payload;
      if (Array.isArray(posts)) {
        state.posts = [...state.posts, ...posts]
      } else {
        state.posts = [...state.posts, posts]
      }
    },
    setPage: (state, action: PayloadAction<{ page: number }>) => {
      const { page } = action.payload;
      state.page = page;
    },
    addComment: (state, action: PayloadAction<{ comment: CommentDto, postId: number }>) => {
      const { comment, postId } = action.payload;
      const post = state.posts.find(post => post.id === postId);
      if (!post) return;

      post.comments = [comment, ...post.comments];
    }
  }
});

export default postSlice.reducer;

export const selectPosts = (state: RootState) => state.post.posts;
export const selectPage = (state: RootState) => state.post.page;
