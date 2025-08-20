import { GroupChatBox } from "./GroupChatBox";
export interface GroupChatBoxListResponse {
  success: boolean;
  groups: GroupChatBox[];
  totalCount: number;
}
