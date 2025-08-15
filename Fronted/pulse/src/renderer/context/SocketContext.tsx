"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
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
  // Add any other group properties you need
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

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
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

        queryClient.setQueryData(
          [...queryKeys.privateMessages(message.senderId), 1],
          (oldMessages: Message[] = []) => [...oldMessages, message]
        );

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
      });

      newSocket.on("error", (error: any) => {
        console.error("Socket error:", error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, user, queryClient]);

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

      queryClient.setQueryData(
        [...queryKeys.privateMessages(messageData.otherId), 1],
        (oldMessages: Message[] = []) => [...oldMessages, tempMessage]
      );

      socket.emit("send_private_message", messageData);
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
        group: undefined, // Will be filled by server response
      };

      queryClient.setQueryData(
        [...queryKeys.groupMessages(messageData.groupId), 1],
        (oldMessages: GroupMessage[] = []) => [...oldMessages, tempMessage]
      );

      socket.emit("send_group_message", {
        content: messageData.content,
        otherId: messageData.groupId, // Backend expects 'otherId' for group ID
        messageType: messageData.messageType || "text",
        attachmentUrl: messageData.attachmentUrl,
      });
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

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
