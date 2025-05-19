import { GetPostsDto, LikePostsDto, PostDto, SavePostDto } from '../types';
import { createQueryString, httpClient } from './httpClient';

const urlBase = '/api/post'

export const fetchTimeline__api = async (dto: GetPostsDto) => {
  const url = `${urlBase}?page=${dto.page}&user=${dto.user}`
  try {
    const response = await httpClient.get<PostDto[]>(url);
    const posts = response.data as PostDto[]
    console.log('posts')
    console.log(posts);
    return posts;
  } catch (error: any) {
    console.error(error);
    return false;
  }
};

export const createPost__api = async (dto: SavePostDto) => {
  const formData = new FormData();
  formData.append("user", dto.user);

  if (dto.content) formData.append("content", dto.content);
  if (dto.media) formData.append("media", dto.media);

  try {
    const res = await httpClient.post<PostDto>("/api/post", formData, {
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