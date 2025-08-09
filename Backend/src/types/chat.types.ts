import { GroupMemberRole,MessageType,RoomType } from '../utils/helper.util';
export interface GroupAttributes {
  id: string; 
  name: string;
  description?: string | null;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GroupMemberAttributes {
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  joinedAt?: Date;
}


export interface MessageAttributes {
  id: string; 
  senderId: string;
  recipientId?: string;
  groupId?:string, 
  messageTxt?: string;
  messageType: MessageType;
  attachmentUrl?: string;
  sentAt?: Date;
  updatedAt?: Date;
}

export interface SaveMessageData {
  content: string;
  senderId: string;
  otherId: string;
  messageType?: MessageType;
  attachmentUrl?: string;
  roomtype:RoomType
}

export interface RequestMessageData {
  content: string;
  otherId: string;
  messageType?: MessageType;
  attachmentUrl?: string;
}

export interface RequestGroupMessageData {
  content: string;
  groupid: string;
  messageType?: MessageType;
  attachmentUrl?: string;
}

export interface SenderInfo {
  id: string;
  display_name: string;
  profile_picture?: string;
}

export interface GroupMemberInfo {
  id: string;  // GroupMember id or user id? Use whichever you want
  user: SenderInfo;
}

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt?: Date;
  members?: GroupMemberInfo[];
}

export interface MessageResponse {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  groupId?: string;
  messageType: MessageType;
  attachmentUrl?: string;
  sentAt: Date;
  sender?: SenderInfo;
  group?: GroupInfo;
}

export interface GetMessagesResponse {
  messages: MessageResponse[];
  fromCache: boolean;
  hasMore: boolean;
}

export interface LastMessage {
  content: string;
  sentAt: Date;
  senderId: number;
}

export interface ConversationPartner {
  id?: string;
  username?: string;
  profilePicture?: string;
}

export interface ConversationGroup {
  id: string;
  name: string;
  description?: string | null;
}

export interface ConversationItem {
  type: 'private' | 'group';
  // For private conversations
  partnerId?: string;
  partner?: ConversationPartner;
  // For group conversations
  groupId?: string;
  group?: ConversationGroup;
  // Common properties
  lastMessage?: LastMessage | null;
  lastMessageTime: Date;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  createdBy: number;
  memberIds?: string[];
}