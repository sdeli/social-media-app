import { FriendshipDto, FriendShipStatusDto, GetFriendshipsStatusDto, GetPostDto, PostDto, SavePostsDto, SendFriendshipRequestDto } from '../types';
import { httpClient } from './httpClient';

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

export const getFriendshipStatuses__api = async (dto: GetFriendshipsStatusDto) => {
  const url = `${urlBase}/?query=${dto.query}&user=${dto.user}`
  try {
    const response = await httpClient.get<FriendShipStatusDto[]>(url);
    return response.data
  } catch (error: any) {
    console.error(error);
    return false;
  }
};