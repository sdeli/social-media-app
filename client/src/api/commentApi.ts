import { CommentDto, GetCommentsDto, PostDto } from '../types';
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