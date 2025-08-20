import { GroupMember } from "./GroupMember";
export interface GroupResponse {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  members: GroupMember[];
}
