"use client";

import React from "react";
import styles from "./style.module.scss";
import MessageComponent from "../Message";
import TextEditor from "../TextEditor";
import { rightfilledarrow, mic, video } from "../../assets/icons";
import { useChatMessages } from "../../hooks/useChat";
import { useSendMessage } from "../../hooks/useChat";

interface ChatData {
  id: string;
  name: string;
  avatar_url?: string;
  type: "group" | "direct";
}

interface DirectChatProps {
  chatData: ChatData | null;
}

const DirectChat = ({ chatData }: DirectChatProps) => {
  if (!chatData) {
    return (
      <div className={styles.directChat}>
        <div className={styles.placeholder}>
          Select a chat to start messaging
        </div>
      </div>
    );
  }
  console.log(chatData.id);
  const { messages, isLoading } = useChatMessages(chatData.id);

  // Send message hook
  const { sendMessage, canSend } = useSendMessage();

  const handleSendMessage = (content: string) => {
    if (canSend && content.trim()) {
      sendMessage(chatData.id, content);
    }
  };

  return (
    <div className={styles.chatArea}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatInfo}>
          <h2 className={styles.chatTitle}>
            {chatData.name}
            <img
              src={rightfilledarrow}
              alt="arrow"
              className={styles.arrowIcon}
            />
          </h2>
        </div>
        <div className={styles.headerActions}>
          <img src={mic} alt="mic" className={styles.actionIcon} />
          <img src={video} alt="video" className={styles.actionIcon} />
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesList}>
        {isLoading && <div>Loading messages...</div>}
        {!isLoading && messages.length === 0 && (
          <div className={styles.noMessages}>No messages yet</div>
        )}
        {!isLoading &&
          messages.map((msg) => (
            <MessageComponent key={msg.id} message={msg} />
          ))}
      </div>

      {/* Text Editor */}
      <TextEditor textTo={chatData.name} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default DirectChat;
