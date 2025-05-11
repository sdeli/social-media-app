export interface getPostsDto {
  page: number,
  user: number
}

export interface savePostsDto {
  content: string;
  user: number
}

export interface SendFriendshipRequestDto {
  acceptedBy: number,
  user: number
}

export interface GetFriendshipsStatusDto {
  query: string,
  user: number
}