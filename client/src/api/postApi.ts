import { PostDto, SavePostDto } from '../types';
import { createQueryString, httpClient } from './httpClient';

const urlBase = '/api/posts'

export const fetchTimeline__api = async (dto: SavePostDto) => {
  const url = `${urlBase}?page=${dto.page}&user=${dto.user}`
  try {
    const response = await httpClient.get<PostDto[]>(url);
    return response.data as PostDto[];
  } catch (error: any) {
    return false;
  }
};