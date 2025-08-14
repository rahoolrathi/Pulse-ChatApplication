import { ChatUser } from "./ChatUser";
export interface PrivateChat {
  partnerId: string;
  partner: ChatUser;
  id?: string;
}
