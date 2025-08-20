import { Members } from "./Members";
export interface ChatData {
  id: string;
  name: string;
  avatar_url?: string;
  type: "group" | "direct";
  members?: Members[];
}
