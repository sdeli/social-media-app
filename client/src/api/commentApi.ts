import { CommentDto, GetCommentsDto, PostCommentDto } from '../types';
import { httpClient } from './httpClient';

const urlBase = '/api/comment'

export const fetchComments__api = async (dto: GetCommentsDto) => {
  const url = `${urlBase}?page=${dto.page}&user=${dto.user}&postId=${dto.postId}`
  try {
    const response = await httpClient.get<CommentDto[]>(url);
    return response.data as CommentDto[];
  } catch (error: any) {
    console.error(error);
    return false;
  }
};

export const postComment__api = async (dto: PostCommentDto) => {
  const formData = new FormData();
  formData.append("user", dto.user);
  formData.append("postId", dto.postId.toString());

  if (dto.content) formData.append("content", dto.content);
  if (dto.media) formData.append("media", dto.media);

  try {
    const res = await httpClient.post<CommentDto>(urlBase, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data as CommentDto;
  } catch (error: any) {
    console.error(error);
    return false;
  }
};