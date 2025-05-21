export interface GetPostsDto {
  page: number,
  user: string
}

export interface SavePostDto {
  user: string
  content?: string;
  media?: File,
}

export interface SendFriendshipRequestDto {
  acceptedBy: string,
  user: string
}

export interface GetFriendshipsStatusDto {
  query: string,
  user: string
}

export interface GetPossibleFriendsDto {
  query: string,
  user: string
  page: number
}

export interface GetFriendsDto {
  query?: string,
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

export interface FriendshipDto {
  id: number;
  requestedBy: UserDto;
  reqUnread?: number;
  acceptedBy: UserDto;
  accUnread?: number;
  lastMessage?: number | null;
  lastMessageTime?: string | null;
  acceptedAt?: string | null;
  status?: FriendshipStatus | null;
  updatedAt: string;
  createdAt: string;
}

export interface PostDto {
  id: number;
  postedBy: UserDto;
  content: string | null;
  media: string | null;
  mediaType: string | null;
  likes: number;
  dislikes?: number;
  createdAt: string;
  updatedAt: string;
  comments: CommentDto[]
  likesDislike: LikeDislikeDto[]
}

export interface UserDto {
  id: string;
  username: string | null;
  email: string;
  picture: string | null;
}
export interface FriendShipStatusDto extends UserDto {
  status: FriendshipStatus
}

export interface MessageDto {
  id: number;
  senderId: number; // User.id
  receiverId: number; // User.id
  text?: string;
  media?: string | null;
  mediaType?: string;
  isRead: boolean;
  createdAt: string;
  callType?: 'audio-call' | 'video-call' | null;
  callDuration?: number | null;
}

export interface OnlineStatusDto {
  id: number;
  userId: number;
  status: OnlineStatusType;
  lastConnected: string; // ISO 8601 timestamp
  createdAt: string;
  updatedAt: string;
}

export interface CommentDto {
  id: number;
  commentedBy: UserDto;
  content?: string | null;
  media?: string | null;
  mediaType: string | null;
  createdAt: string;
  updatedAt: string;
  postId?: number | null;
}

export interface LikeDislikeDto {
  id: number;
  user: UserDto;
  isLike?: boolean | null;
  commentId?: number | null;
  postId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TokensDto {
  access_token: string;
  refresh_token: string;
}

export interface LoggedInUserDto {
  user: UserDto;
  tokens: TokensDto;
  text: string;
  // meta: WordMeta | null;
  updatedAt: Date;
}

export interface LoginDto {
  username: string;
  email?: string;
  password: string;
}

export enum FriendshipStatus {
  Requested = 'requested',
  Accepted = 'accepted',
  Blocked = 'blocked',
}

export enum CallType {
  AudioCall = 'audio-call',
  VideoCall = 'video-call',
}

export enum OnlineStatusType {
  Online = 'online',
  Offline = 'offline',
  Away = 'away',
  Busy = 'busy',
}
