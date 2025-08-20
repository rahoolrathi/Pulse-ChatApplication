import User from "./User";
export interface PrivateChatListResponse {
  success: boolean;
  conversations: User[];
  totalCount: number;
}
