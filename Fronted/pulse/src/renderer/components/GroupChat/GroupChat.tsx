"use client";

import styles from "./style.module.scss";
import MessageComponent from "../Message";
import TextEditor from "../TextEditor";
import { useGroupChatMessages, useSendGroupMessage } from "../../hooks/useChat";
import {
  logo,
  rightfilledarrow,
  filledmic,
  filledvideo,
} from "../../assets/icons";
interface Members {
  id: string;
  profile_picture: string;
  display_name: string;
}
type groupData = {
  id: string;
  name: string;
  members: Members[];
};

type GroupChatProps = {
  groupData: groupData;
};
const SERVER_URL = "http://localhost:4000";
function getAvatarUrl(profilePath?: string) {
  if (!profilePath) return undefined; // fallback to default logo
  // Replace backslashes with forward slashes and prepend server URL
  return `${SERVER_URL}${profilePath.replace(/\\/g, "/")}`;
}
export default function GroupChat({ groupData }: GroupChatProps) {
  const { messages, isLoading, error, refetch } = useGroupChatMessages(
    groupData.id
  );

  const { sendMessage, isConnected, canSend } = useSendGroupMessage();

  const handleSendMessage = (content: string, messageType: string = "text") => {
    if (!canSend) {
      console.error("Cannot send message: not connected to server");
      return;
    }

    try {
      sendMessage(groupData.id, content, messageType);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // ===== FAKE DATA =====
  const creator = { username: "john_doe", display_name: "John Doe" };
  const group = { created_at: new Date() };
  const membersLoading = false;

  return (
    <div className={styles.chatArea}>
      <div className={styles.chatHeader}>
        <div className={styles.chatInfo}>
          <h2 className={styles.chatTitle}>
            {groupData?.name || "Group Name"}
            <span className={styles.groupPrefix}>
              <img src={rightfilledarrow} style={{ marginLeft: "8px" }} />
            </span>
          </h2>
        </div>

        <div className={styles.members}>
          {groupData.members?.slice(0, 3).map((member, index) => (
            <div
              key={member.id}
              className={styles.memberAvatar}
              title={member.display_name}
              style={{
                backgroundImage: `url(${getAvatarUrl(member.profile_picture)})`,
                backgroundColor: member.profile_picture
                  ? "transparent"
                  : "#BCE1FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#08344D",
                fontWeight: "bold",
                fontSize: "14px",
                zIndex: index + 1,
                marginLeft: index === 0 ? "0" : "-22px",
              }}
            >
              {!member.profile_picture &&
                member.display_name.charAt(0).toUpperCase()}
            </div>
          ))}

          {groupData.members && (
            <div
              className={styles.memberAvatar}
              style={{
                backgroundColor: "#BCE1FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#08344D",
                fontWeight: "bold",
                fontSize: "14px",
                zIndex: 6,
                marginLeft: groupData.members.length > 0 ? "-22px" : "0",
              }}
            >
              {membersLoading ? "..." : `${groupData.members.length}`}
            </div>
          )}
        </div>

        <img src={filledmic} alt="mic" className={styles.actionIcon} />
        <img src={filledvideo} alt="video" className={styles.actionIcon} />
      </div>

      <div className={styles.messagesList}>
        {isLoading ? (
          <div className={styles.loading}>Loading messages...</div>
        ) : (
          messages
            .slice()
            .reverse()
            .map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))
        )}
      </div>

      <TextEditor onSendMessage={handleSendMessage} textTo={groupData?.name} />
    </div>
  );
}
