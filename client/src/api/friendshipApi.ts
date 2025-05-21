import { GetFriendsRequestsDto } from './../../../server/dto';
import { AcceptFriendsRequestsDto, FriendshipDto, FriendShipStatusDto, GetFriendshipsStatusDto, GetPossibleFriendsDto, SendFriendshipRequestDto, UserDto } from '../types';
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
    const response = await httpClient.get<UserDto[]>(url);
    return response.data
  } catch (error: any) {
    console.error(error);
    return false;
  }
};

export const getAllFriendships__api = async (dto: GetFriendsRequestsDto) => {
  const url = `${urlBase}/all/?user=${dto.user}`
  try {
    const response = await httpClient.get<FriendshipDto[]>(url);
    return response.data
  } catch (error: any) {
    console.error(error);
    return false;
  }
};

export const acceptFriendshipRequests__api = async (dto: AcceptFriendsRequestsDto) => {
  const url = `${urlBase}/accept`

  try {
    const response = await httpClient.post<FriendshipDto>(url, dto);
    return response.data
  } catch (error: any) {
    console.error(error);
    return false;
  }
};

export const getPossibleFriends__api = async (dto: GetPossibleFriendsDto) => {
  const url = `/api/possible-friends/?query=${dto.query}&user=${dto.user}&page=${dto.page}`

  try {
    const response = await httpClient.get<UserDto[]>(url);
    return response.data
  } catch (error: any) {
    console.error(error);
    return false;
  }
};