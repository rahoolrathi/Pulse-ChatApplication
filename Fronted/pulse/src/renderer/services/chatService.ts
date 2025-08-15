// services/chatService.ts
import {
  MessagesResponse,
  Message,
  PrivateChat,
  PrivateChatListResponse,
  groupMessagesResponse,
  groupMessage,
} from "../types/index";
const API_BASE_URL = "http://localhost:4000/api";
interface User {
  id: string;
  username: string;
  display_name: string;
  profile_picture: string | null;
}

interface Userprofiles {
  id: string;
  username: string;
  display_name: string;
  profile_picture: string | null;
  email: string;
}
interface GroupChatBox {
  groupId: string;
  group: {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
  };
  userRole: "admin" | "member";
}
interface GroupChatBoxListResponse {
  success: boolean;
  groups: GroupChatBox[];
  totalCount: number;
}
export interface DirectChatResponse {
  id: string;
  name: string;
  avatar_url?: string;
  type: "direct";
}
interface GroupMember {
  groupId: string;
  userId: string;
  role: "admin" | "member";
  joinedAt: string;
  user: {
    id: string;
    display_name: string;
    profile_picture: string | null;
  };
}

export interface GroupResponse {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  members: GroupMember[];
}
class ChatService {
  private getAuthHeaders(token: string) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async getPrivateChatList(token: string): Promise<PrivateChat[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/privatechatboxlist`, {
        method: "GET",
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PrivateChatListResponse = await response.json();
      console.log("Private chat list response:", data);

      if (data.success && data.conversations) {
        return data.conversations;
      } else {
        throw new Error("Failed to fetch private chat list");
      }
    } catch (error) {
      console.error("Error fetching private chat list:", error);
      throw error;
    }
  }

  async getPrivateMessages(
    token: string,
    otherUserId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Message[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chats/privatemessages/${otherUserId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MessagesResponse = await response.json();
      console.log("Private messages response:", data);

      if (data.messages) {
        return data.messages;
      } else {
        throw new Error("Failed to fetch private messages");
      }
    } catch (error) {
      console.error("Error fetching private messages:", error);
      throw error;
    }
  }

  async searchUsers(token: string, key: string): Promise<User[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/search?key=${encodeURIComponent(key)}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: User[] = await response.json();
      console.log("Search users response:", data);

      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getAllUsers(token: string): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/allprofile`, {
        method: "GET",
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch users");
      }

      const users: Userprofiles[] = result.data;
      console.log("users response:", users);

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async createDirectChat(
    token: string,
    otherUserId: string
  ): Promise<DirectChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/directchat`, {
        method: "POST",
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ otherUserId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DirectChatResponse = await response.json();
      console.log("Direct chat created successfully:", data);

      return data;
    } catch (error) {
      console.error("Error creating direct chat:", error);
      throw error;
    }
  }

  async createGroup(
    token: string,
    name: string,
    description: string,
    memberIds: string[]
  ): Promise<GroupResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/group`, {
        method: "POST",
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({
          name,
          description,
          memberIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GroupResponse = await response.json();
      console.log("Group created successfully:", data);

      return data;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  }

  async getGroupChatList(token: string): Promise<GroupChatBox[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/groupchatboxlist`, {
        method: "GET",
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GroupChatBoxListResponse = await response.json();
      console.log("Group chat list response:", data);

      if (data.success && data.groups) {
        return data.groups;
      } else {
        throw new Error("Failed to fetch group chat list");
      }
    } catch (error) {
      console.error("Error fetching group chat list:", error);
      throw error;
    }
  }

  async getGroupMessages(
    token: string,
    groupId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<groupMessage[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chats/groupmessages/${groupId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: groupMessagesResponse = await response.json();
      console.log(`Group messages for ${groupId}:`, data);

      if (data.messages) {
        return data.messages;
      } else {
        throw new Error("Failed to fetch group messages");
      }
    } catch (error) {
      console.error("Error fetching group messages:", error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
