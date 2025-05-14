export interface GetPostsDto {
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

export interface LikePostsDto {
  postId: number,
  isLike: boolean,
  user: number
}

export interface GetCommentsDto {
  page: number,
  user: number,
  postId: number,
}

export interface PostCommentDto {
  user: number,
  postId: number;
  content: string;
  media?: any;
}

export interface GetFriendsDto {
  query?: string,
  user: number
}

export interface GetFriendsRequestsDto {
  user: number
}

export interface AcceptFriendsRequestsDto {
  friendshipId: number;
  accepted: boolean;
  user: number;
}

export interface EditUserDto {
  name: string,
  prevPassword: string,
  newPassword: string,
  confirmPassword: string,
  picture: any | null,
  user: number
}
