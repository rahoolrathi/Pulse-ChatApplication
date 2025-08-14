import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { chatService } from "../services/chatService";
import { queryKeys } from "../lib/queryClient";

export const usePrivateChatList = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.privateChatList,
    queryFn: () => chatService.getPrivateChatList(token!),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook for private messages
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
