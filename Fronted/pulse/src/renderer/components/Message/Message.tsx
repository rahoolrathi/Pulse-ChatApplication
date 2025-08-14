"use client";

import React from "react";
import styles from "./style.module.scss";
import { logo } from "../../assets/icons";
import { useAuth } from "../../context/AuthContext";
import { Message } from "../../types";
const SERVER_URL = "http://localhost:4000";

/**
 * Returns a browser-friendly avatar URL
 * @param profilePath - the path from backend
 */
export function getAvatarUrl(profilePath?: string) {
  if (!profilePath) return logo; // fallback to default logo
  // Replace backslashes with forward slashes and prepend server URL
  return `${SERVER_URL}${profilePath.replace(/\\/g, "/")}`;
}
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else if (diffInHours < 168) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
};

type MessageProps = {
  message: Message;
};

export default function Message({ message }: MessageProps) {
  const { user } = useAuth();
  const isOwnMessage = message.senderId === user?.id;
  console.log(message);
  return (
    <div
      className={`${styles.message} ${
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      }`}
    >
      {/* Avatar for both own & others */}
      <div
        className={styles.avatar}
        style={{
          backgroundImage: `url(${
            isOwnMessage ? logo : getAvatarUrl(message.sender?.profile_picture)
          })`,
        }}
      />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>
            {isOwnMessage ? "You" : message.sender.display_name}
          </span>
          <span className={styles.timestamp}>
            {formatTimestamp(message.sentAt)}
          </span>
        </div>
        <div className={styles.messageText}>{message.content}</div>
      </div>
    </div>
  );
}
