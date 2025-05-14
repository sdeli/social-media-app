import { FriendshipDto, FriendShipStatusDto, GetFriendsDto, GetFriendshipsStatusDto, GetPostDto, PostDto, SavePostsDto, SendFriendshipRequestDto, UserDto } from '../types';
import { httpClient } from './httpClient';

const urlBase = '/api/user'

export const getFriendsList__api = async (dto: GetFriendsDto) => {
  const url = `${urlBase}/friends/?${dto.query ? `query=${dto.query}&` : ''}user=${dto.user}`
  try {
    const response = await httpClient.get<UserDto[]>(url);
    return response.data
  } catch (error: any) {
    console.error(error);
    return false;
  }
};