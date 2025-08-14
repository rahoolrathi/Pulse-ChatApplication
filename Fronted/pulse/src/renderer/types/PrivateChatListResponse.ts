import { PrivateChat } from "./PrivateChat";
export interface PrivateChatListResponse {
  success: boolean;
  conversations: PrivateChat[];
  totalCount: number;
}
