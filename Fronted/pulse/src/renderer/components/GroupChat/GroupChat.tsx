"use client";

import styles from "./style.module.scss";
import MessageComponent from "../Message";
import TextEditor from "../TextEditor";
import { useGroupChatMessages, useSendGroupMessage } from "../../hooks/useChat";

type GroupChatProps = {
  groupId: string;
};

export default function GroupChat({ groupId }: GroupChatProps) {
  const { messages, isLoading, error, refetch } = useGroupChatMessages(groupId);

  const { sendMessage, isConnected, canSend } = useSendGroupMessage();

  const handleSendMessage = (content: string, messageType: string = "text") => {
    if (!canSend) {
      console.error("Cannot send message: not connected to server");
      return;
    }

    try {
      sendMessage(groupId, content, messageType);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className={styles.chatArea}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <h2>Group Chat</h2>
        {!isConnected && (
          <span className={styles.connectionStatus}>Disconnected</span>
        )}
      </div>

      {/* Messages */}
      <div className={styles.messagesList}>
        {isLoading ? (
          <div className={styles.loading}>Loading messages...</div>
        ) : error ? (
          <div className={styles.error}>
            Error loading messages
            <button onClick={() => refetch()}>Retry</button>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.empty}>No messages yet</div>
        ) : (
          messages
            .slice()
            .reverse() // Reverse to show newest messages at bottom
            .map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))
        )}
      </div>

      {/* Text Input */}
      <TextEditor textTo="Group Chat" onSendMessage={handleSendMessage} />
    </div>
  );
}
