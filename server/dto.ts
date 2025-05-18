export interface GetPostsDto {
  page: number,
  user: string
}

export interface SavePostDto {
  content: string;
  user: string
}

export interface SendFriendshipRequestDto {
  acceptedBy: number,
  user: string
}

export interface GetFriendshipsStatusDto {
  query: string,
  user: string
}

export interface LikePostsDto {
  postId: number,
  isLike: boolean,
  user: string
}

export interface GetCommentsDto {
  page: number,
  user: string,
  postId: number,
}

export interface PostCommentDto {
  user: string,
  postId: number;
  content: string;
  media?: any;
}

export interface GetFriendsDto {
  query?: string,
  user: string
}

export interface GetFriendsRequestsDto {
  user: string
}

export interface AcceptFriendsRequestsDto {
  friendshipId: number;
  accepted: boolean;
  user: string;
}

export interface EditUserDto {
  name: string,
  prevPassword: string,
  newPassword: string,
  confirmPassword: string,
  picture: any | null,
  user: string
}
