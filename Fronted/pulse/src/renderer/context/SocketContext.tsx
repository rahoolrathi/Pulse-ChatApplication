"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import { Message, PrivateChat } from "../types";

export interface GroupMessage {
  id: string;
  content: string;
  senderId: string;
  groupId: string;
  messageType: string;
  attachmentUrl: string | null;
  sentAt: string;
  sender: {
    id: string;
    display_name: string;
    profile_picture: string | undefined;
  };
  group?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: GroupMessage;
  memberCount?: number;
}

interface sendMessageData {
  content: string;
  otherId: string;
  messageType?: string;
  attachmentUrl?: string;
}

interface sendGroupMessageData {
  content: string;
  groupId: string;
  messageType?: string;
  attachmentUrl?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendPrivateMessage: (messageData: sendMessageData) => void;
  sendGroupMessage: (messageData: sendGroupMessageData) => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user, isLoading } = useAuth();
  console.log(token);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLoading || !token || !user) {
      console.log("Socket effect - waiting for auth:", {
        token: !!token,
        user: !!user,
        isLoading,
      });
      return;
    }
    console.log("oso", user);
    console.log("Creating socket connection for user:", user.id);
    if (token && user) {
      const newSocket = io("http://localhost:4000", {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      // Private message handlers
      newSocket.on("private_message_received", (message: Message) => {
        console.log("Private message received:", message);

        // Update messages cache
        queryClient.setQueryData(
          [...queryKeys.privateMessages(message.senderId), 1],
          (oldMessages: Message[] = []) => [...oldMessages, message]
        );

        // Update chat list cache
        queryClient.setQueryData(
          queryKeys.privateChatList,
          (oldChats: PrivateChat[] = []) =>
            oldChats.map((chat) => {
              if (chat.partner?.id === message.senderId) {
                return {
                  ...chat,
                  lastMessage: message,
                  updatedAt: message.sentAt,
                };
              }
              return chat;
            })
        );

        // Invalidate related queries to ensure fresh data
        queryClient.invalidateQueries({
          queryKey: queryKeys.privateChatList,
        });
      });

      newSocket.on("message_sent", (message: Message) => {
        console.log("Message sent confirmation:", message);

        queryClient.setQueryData(
          [...queryKeys.privateMessages(message.recipientId), 1],
          (oldMessages: Message[] = []) =>
            oldMessages.map((msg) =>
              msg.id.startsWith("temp-") && msg.content === message.content
                ? message
                : msg
            )
        );

        // Invalidate chat list to update last message timestamp
        queryClient.invalidateQueries({
          queryKey: queryKeys.privateChatList,
        });
      });

      // Group message handlers
      newSocket.on("group_message_received", (message: GroupMessage) => {
        console.log("Group message received:", message);

        // Update group messages cache
        queryClient.setQueryData(
          [...queryKeys.groupMessages(message.groupId), 1],
          (oldMessages: GroupMessage[] = []) => [...oldMessages, message]
        );

        // Update group chat list with latest message
        queryClient.setQueryData(
          queryKeys.groupChatList,
          (oldChats: GroupChat[] = []) =>
            oldChats.map((chat) => {
              if (chat.id === message.groupId) {
                return {
                  ...chat,
                  lastMessage: message,
                  updatedAt: message.sentAt,
                };
              }
              return chat;
            })
        );

        // Invalidate related group queries
        queryClient.invalidateQueries({
          queryKey: queryKeys.groupChatList,
        });
      });

      newSocket.on("group_message_sent", (message: GroupMessage) => {
        console.log("Group message sent confirmation:", message);

        queryClient.setQueryData(
          [...queryKeys.groupMessages(message.groupId), 1],
          (oldMessages: GroupMessage[] = []) =>
            oldMessages.map((msg) =>
              msg.id.startsWith("temp-group-") &&
              msg.content === message.content
                ? message
                : msg
            )
        );

        // Invalidate group chat list
        queryClient.invalidateQueries({
          queryKey: queryKeys.groupChatList,
        });
      });

      // Handle connection errors and reconnection
      newSocket.on("connect_error", (error: any) => {
        console.error("Connection error:", error);

        // On reconnection, invalidate all cached data to ensure consistency
        setTimeout(() => {
          if (newSocket.connected) {
            console.log("Reconnected - invalidating all queries");
            queryClient.invalidateQueries();
          }
        }, 1000);
      });

      newSocket.on("error", (error: any) => {
        console.error("Socket error:", error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, user, queryClient, isLoading]);

  const sendPrivateMessage = (messageData: sendMessageData) => {
    if (socket && isConnected && user) {
      console.log("Sending private message:", messageData);

      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageData.content,
        senderId: user.id,
        recipientId: messageData.otherId,
        messageType: "text",
        sentAt: new Date().toISOString(),
        sender: {
          id: user.id,
          display_name: user.display_name,
          profile_picture: undefined,
        },
      };

      // Optimistically update cache
      queryClient.setQueryData(
        [...queryKeys.privateMessages(messageData.otherId), 1],
        (oldMessages: Message[] = []) => [...oldMessages, tempMessage]
      );

      // Send the message
      socket.emit("send_private_message", messageData);

      // Optionally invalidate after a short delay if no confirmation received
      setTimeout(() => {
        const currentMessages = queryClient.getQueryData([
          ...queryKeys.privateMessages(messageData.otherId),
          1,
        ]) as Message[];

        const stillTemp = currentMessages?.some(
          (msg) =>
            msg.id.startsWith("temp-") && msg.content === messageData.content
        );

        if (stillTemp) {
          console.log("Message confirmation not received, invalidating cache");
          queryClient.invalidateQueries({
            queryKey: [...queryKeys.privateMessages(messageData.otherId)],
          });
        }
      }, 10000); // 10 second timeout
    }
  };

  const sendGroupMessage = (messageData: sendGroupMessageData) => {
    if (socket && isConnected && user) {
      console.log("Sending group message:", messageData);

      const tempMessage: GroupMessage = {
        id: `temp-group-${Date.now()}`,
        content: messageData.content,
        senderId: user.id,
        groupId: messageData.groupId,
        messageType: messageData.messageType || "text",
        attachmentUrl: messageData.attachmentUrl || null,
        sentAt: new Date().toISOString(),
        sender: {
          id: user.id,
          display_name: user.display_name,
          profile_picture: undefined,
        },
        group: undefined,
      };

      // Optimistically update cache
      queryClient.setQueryData(
        [...queryKeys.groupMessages(messageData.groupId), 1],
        (oldMessages: GroupMessage[] = []) => [...oldMessages, tempMessage]
      );

      // Send the message
      socket.emit("send_group_message", {
        content: messageData.content,
        otherId: messageData.groupId,
        messageType: messageData.messageType || "text",
        attachmentUrl: messageData.attachmentUrl,
      });

      // Timeout fallback for group messages
      setTimeout(() => {
        const currentMessages = queryClient.getQueryData([
          ...queryKeys.groupMessages(messageData.groupId),
          1,
        ]) as GroupMessage[];

        const stillTemp = currentMessages?.some(
          (msg) =>
            msg.id.startsWith("temp-group-") &&
            msg.content === messageData.content
        );

        if (stillTemp) {
          console.log(
            "Group message confirmation not received, invalidating cache"
          );
          queryClient.invalidateQueries({
            queryKey: [...queryKeys.groupMessages(messageData.groupId)],
          });
        }
      }, 10000);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendPrivateMessage,
        sendGroupMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
