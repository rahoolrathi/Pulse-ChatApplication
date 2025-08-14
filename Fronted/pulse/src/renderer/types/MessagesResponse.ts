import { Message } from "./Message";
export interface MessagesResponse {
  messages: Message[];
  fromCache?: boolean;
  hasMore?: boolean;
}
