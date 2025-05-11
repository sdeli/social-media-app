export interface GetPostDto {
  page: number,
  user: number
}

export interface SavePostsDto {
  user: number
  content?: string;
  media?: File,
}

export interface SendFriendshipRequestDto {
  acceptedBy: number,
  user: number
}

export interface GetFriendshipsStatusDto {
  query: string,
  user: number
}

export interface FriendshipDto {
  id: number;
  requestedBy: number;
  reqUnread?: number;
  acceptedBy: number;
  accUnread?: number;
  lastMessage?: number | null;
  lastMessageTime?: string | null;
  acceptedAt?: string | null;
  status?: FriendshipStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostDto {
  id: number;
  User: UserDto; // User.id
  content: string | null;
  media: string | null;
  mediaType: string | null;
  likes: number;
  dislikes?: number;
  createdAt: string;
  updatedAt: string;
  lastComment: CommentDto
}

export interface UserDto {
  id: number;
  name?: string;
  email: string;
  password: string;
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
  User: UserDto;
  content?: string | null;
  media?: string | null;
  mediaType?: string | null;
  createdAt: string;
  updatedAt: string;
  postId?: number | null;
}

export interface LikeDislikeDto {
  id: number;
  userId: number;
  isLike?: boolean | null;
  commentId?: number | null;
  postId?: number | null;
  createdAt: string;
  updatedAt: string;
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
