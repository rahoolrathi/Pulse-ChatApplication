import { Message,groupMessage } from "./Message";
export interface MessagesResponse {
  messages: Message[];
  fromCache?: boolean;
  hasMore?: boolean;
}

export interface groupMessagesResponse {
  messages: groupMessage[];
  fromCache?: boolean;
  hasMore?: boolean;
}