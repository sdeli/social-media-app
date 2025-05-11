import { FriendshipDto, GetPostDto, PostDto, SavePostsDto, SendFriendshipRequestDto } from '../types';
import { createQueryString, httpClient } from './httpClient';

const urlBase = '/api/friendship'

export const sendFriendRequest__api = async (dto: SendFriendshipRequestDto) => {
  const url = `${urlBase}/request`
  try {
    const response = await httpClient.post<FriendshipDto>(url, dto);
    return response.data
  } catch (error: any) {
    console.error(error);
    return false;
  }
};