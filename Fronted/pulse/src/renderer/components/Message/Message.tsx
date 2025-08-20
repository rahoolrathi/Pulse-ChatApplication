"use client";

import React from "react";
import styles from "./style.module.scss";
import { logo } from "../../assets/icons";
import hooks from "../../hooks";
import { dbPathToUrl } from "../../utils/helper";
import { Message } from "../../types";

type MessageProps = {
  message: Message;
};

export default function Message({ message }: MessageProps) {
  const { user } = hooks.useAuth();
  const isOwnMessage = message.senderId === user?.id;

  return (
    <div
      className={`${styles.message} ${
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      }`}
    >
      {/* Avatar */}
      <div
        className={styles.avatar}
        style={{
          backgroundImage: `url(${
            isOwnMessage
              ? logo
              : message.sender?.profile_picture
                ? dbPathToUrl(message.sender.profile_picture)
                : logo
          })`,
        }}
      />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>
            {isOwnMessage ? "You" : message.sender.display_name}
          </span>
          {/* Fake timestamp right after name */}
          <span className={styles.timestamp}>09:45am</span>
        </div>

        <div className={styles.messageText}>{message.content}</div>
      </div>
    </div>
  );
}
