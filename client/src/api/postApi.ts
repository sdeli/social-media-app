import { GetPostDto, LikePostsDto, PostDto, SavePostsDto } from '../types';
import { createQueryString, httpClient } from './httpClient';

const urlBase = '/api/post'

export const fetchTimeline__api = async (dto: GetPostDto) => {
  const url = `${urlBase}?page=${dto.page}&user=${dto.user}`
  try {
    const response = await httpClient.get<PostDto[]>(url);
    return response.data as PostDto[];
  } catch (error: any) {
    console.error(error);
    return false;
  }
};

export const createPost__api = async (dto: SavePostsDto) => {
  const formData = new FormData();
  formData.append("user", dto.user.toString());

  if (dto.content) formData.append("content", dto.content);
  if (dto.media) formData.append("media", dto.media);

  try {
    const res = await httpClient.post("/api/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    console.error(error);
    return false
  }
}

export const likePost__api = async (dto: LikePostsDto) => {
  const url = `${urlBase}/like`
  try {
    const response = await httpClient.post<PostDto>(url, dto);
    return response.data as PostDto;
  } catch (error: any) {
    console.error(error);
    return false;
  }
};