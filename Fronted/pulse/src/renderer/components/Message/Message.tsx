'use client';

import React from 'react';
import styles from './style.module.scss';
import { logo } from '../../assets/icons';
// import { formatTimestamp } from '@/lib/utils';

export default function Message() {
  // Static example message data
  const message = {
    user: {
      avatar_url: logo,
      display_name: 'John Doe',
    },
    content: 'Hello, this is a static message!',
    timestamp: new Date().toISOString(),
  };

  return (
    <div className={styles.message}>
      <div
        className={styles.avatar}
        style={{
          backgroundImage: `url(${message.user.avatar_url})`,
        }}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>{message.user.display_name}</span>
          <span className={styles.timestamp}>
            {/* {formatTimestamp(message.timestamp).match(/\d{1,2}:\d{2} [AP]M/)?.[0]} */}
          </span>
        </div>
        <div className={styles.messageText}>{message.content}</div>
      </div>
    </div>
  );
}
