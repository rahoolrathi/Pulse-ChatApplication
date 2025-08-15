import { ChatUser } from "./ChatUser";
export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId?: string;
  messageType: "text" | "image" | "file";
  attachmentUrl?: string | null;
  sentAt: string;
  sender: ChatUser;
}

export interface groupMessage {
  id: string;
  content: string;
  senderId: string;
  groupId?: string;
  messageType: "text" | "image" | "file";
  attachmentUrl?: string | null;
  sentAt: string;
  sender: ChatUser;
}
