import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { chatService } from "../services/chatService";
import { queryKeys } from "../lib/queryClient";

// Private Chat Hooks
export const usePrivateChatList = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.privateChatList,
    queryFn: () => chatService.getPrivateChatList(token!),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePrivateMessages = (
  otherUserId: string | null,
  page: number = 1
) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.privateMessages(otherUserId || ""), page],
    queryFn: () => chatService.getPrivateMessages(token!, otherUserId!, page),
    enabled: !!token && !!otherUserId,
    staleTime: 30 * 1000,
  });
};

export const useChatList = () => {
  const chatQuery = usePrivateChatList();

  return {
    chats: chatQuery.data || [],
    isLoading: chatQuery.isLoading,
    error: chatQuery.error,
    refetch: chatQuery.refetch,
  };
};

export const useChatMessages = (otherUserId: string | null) => {
  const messagesQuery = usePrivateMessages(otherUserId);

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    refetch: messagesQuery.refetch,
  };
};

export const useSendMessage = () => {
  const { sendPrivateMessage, isConnected } = useSocket();

  const sendMessage = (
    otherUserId: string,
    content: string,
    messageType?: string
  ) => {
    if (!isConnected) {
      throw new Error("Not connected to server");
    }

    sendPrivateMessage({
      content,
      otherId: otherUserId,
      messageType: messageType || "text",
    });
  };

  return {
    sendMessage,
    isConnected,
    canSend: isConnected,
  };
};

// Group Chat Hooks
export const useGroupChatList = () => {
  const { token } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.groupChatList,
    queryFn: () => chatService.getGroupChatList(token!),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });

  return {
    ...query,
    refetchGroupChats: query.refetch,
  };
};

export const useGroupMessages = (
  groupId: string | null,
  page: number = 1,
  limit: number = 50
) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.groupMessages(groupId || ""), page],
    queryFn: () => chatService.getGroupMessages(token!, groupId!, page, limit),
    enabled: !!token && !!groupId,
    staleTime: 30 * 1000,
  });
};

export const useGroupChatMessages = (groupId: string | null) => {
  const messagesQuery = useGroupMessages(groupId);

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    refetch: messagesQuery.refetch,
  };
};

export const useSendGroupMessage = () => {
  const { sendGroupMessage, isConnected } = useSocket();

  const sendMessage = (
    groupId: string,
    content: string,
    messageType?: string,
    attachmentUrl?: string
  ) => {
    if (!isConnected) {
      throw new Error("Not connected to server");
    }

    sendGroupMessage({
      content,
      groupId,
      messageType: messageType || "text",
      attachmentUrl,
    });
  };

  return {
    sendMessage,
    isConnected,
    canSend: isConnected,
  };
};

// General User Hooks
export const useAllUsers = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.allUsers,
    queryFn: () => chatService.getAllUsers(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

// Combined hooks for easier usage
export const useGroupChats = () => {
  const groupQuery = useGroupChatList();

  return {
    groups: groupQuery.data || [],
    isLoading: groupQuery.isLoading,
    error: groupQuery.error,
    refetch: groupQuery.refetch,
    refetchGroupChats: groupQuery.refetchGroupChats,
  };
};
