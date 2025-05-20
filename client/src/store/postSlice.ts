import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from './store';
import { CommentDto, PostDto, UserDto } from '../types';

export enum OnlineStatus {
  Connected = "connected",
  Disconnected = "disconnected",
}
export interface PostState {
  posts: PostDto[],
}

const initialState: PostState = { posts: [] };

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
