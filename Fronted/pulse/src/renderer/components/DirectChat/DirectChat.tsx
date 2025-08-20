"use client";

import React from "react";
import styles from "./style.module.scss";
import MessageComponent from "../Message";
import TextEditor from "../TextEditor";
import {
  rightfilledarrow,
  filledmic,
  filledvideo,
  squarelogo,
  logo,
} from "../../assets/icons";
import hooks from "../../hooks";
import { ChatData } from "../../types";
import { dbPathToUrl } from "../../utils/helper";

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
  console.log(chatData);
  const { messages, isLoading } = hooks.useChatMessages(chatData.id);

  // Send message hook
  const { sendMessage, canSend } = hooks.useSendMessage();

  const handleSendMessage = (content: string) => {
    if (canSend && content.trim()) {
      sendMessage(chatData.id, content);
    }
  };
  const profilepic = chatData.avatar_url
    ? dbPathToUrl(chatData.avatar_url)
    : squarelogo;
  return (
    <div className={styles.chatArea}>
      {messages.length > 0 && (
        <div className={`${styles.nomessagecontainer} ${styles.withMessages}`}>
          <img
            src={profilepic}
            className={styles.profilepicture}
            alt="Profile"
          />
          <h1 className={styles.names}>{chatData.name}</h1>
          <p className={styles.pragprah}>
            This conversation is between @{chatData.name} and you. Checkout
            their profile to know more about them.
          </p>
          <button className={styles.viewbtn}>View Profile</button>
        </div>
      )}

      {/* Messages */}
      <div className={styles.messagesList}>
        {isLoading && <div>Loading messages...</div>}
        {!isLoading && messages.length === 0 && (
          <div className={styles.nomessagecontainer}>
            <img
              src={profilepic}
              className={styles.profilepicture}
              alt="Profile"
            />
            <h1 className={styles.names}>{chatData.name}</h1>
            <p className={styles.pragprah}>
              This conversation is between @{chatData.name} and you. Checkout
              their profile to know more about them.
            </p>
            <button className={styles.viewbtn}>View Profile</button>
          </div>
        )}
        {!isLoading &&
          messages.length > 0 &&
          messages
            .slice()
            .reverse()
            .map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
      </div>

      {/* Text Editor */}
      <TextEditor textTo={chatData.name} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default DirectChat;
