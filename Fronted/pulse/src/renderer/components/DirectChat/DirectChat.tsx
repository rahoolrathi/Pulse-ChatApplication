'use client';

import React from 'react';
import styles from './style.module.scss';
import MessageComponent from '../Message';
import TextEditor from '../TextEditor';
import { logo, rightfilledarrow, mic, video } from '../../assets/icons';

interface ChatData {
  id: string;
  name: string;
  avatar_url?: string;
  type: 'group' | 'direct';
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
  const handleSendMessage = (content: string) => {
    console.log('Send message:', content);
  };

  return (
    <div className={styles.chatArea}>
      <div className={styles.chatHeader}>
        <div className={styles.chatInfo}>
          <h2 className={styles.chatTitle}>
            {chatData.name}
            <img src={rightfilledarrow} alt="arrow" className={styles.arrowIcon} />
          </h2>
        </div>
        <div className={styles.headerActions}>
          <img src={mic} alt="mic" className={styles.actionIcon} />
          <img src={video} alt="video" className={styles.actionIcon} />
        </div>
      </div>

      <div className={styles.messagesList}>
        <MessageComponent />
        <MessageComponent />
      </div>

      <TextEditor textTo={chatData.name} />
    </div>
  );
};

export default DirectChat;