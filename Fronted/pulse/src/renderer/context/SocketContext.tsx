"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import { Message, PrivateChat } from "../types";

interface sendMessageData {
  content: string;
  otherId: string;
  messageType?: string;
  attachmentUrl?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendPrivateMessage: (messageData: sendMessageData) => void;
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

      newSocket.on("private_message_received", (message: Message) => {
        console.log("Private message received:", message);

        queryClient.setQueryData(
          [...queryKeys.privateMessages(message.senderId), 1],
          (oldMessages: Message[] = []) => [message, ...oldMessages]
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

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendPrivateMessage,
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
