"use client";

import styles from "./style.module.scss";
import MessageComponent from "../Message";
import TextEditor from "../TextEditor";
import hooks from "../../hooks";
import { GroupChatBox } from "../../types";
import { logo, rightfilledarrow, hash } from "../../assets/icons";

type GroupChatProps = {
  groupData: GroupChatBox;
};
const SERVER_URL = "http://localhost:4000";
function getAvatarUrl(profilePath?: string) {
  if (!profilePath) return undefined;
  return `${SERVER_URL}${profilePath.replace(/\\/g, "/")}`;
}
export default function GroupChat({ groupData }: GroupChatProps) {
  const { messages, isLoading, error, refetch } = hooks.useGroupChatMessages(
    groupData.groupId
  );

  const { sendMessage, isConnected, canSend } = hooks.useSendGroupMessage();

  const handleSendMessage = (content: string, messageType: string = "text") => {
    if (!canSend) {
      console.error("Cannot send message: not connected to server");
      return;
    }

    try {
      sendMessage(groupData.groupId, content, messageType);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // ===== FAKE DATA =====
  const creator = { username: "john_doe", display_name: "John Doe" };
  const group = { created_at: new Date() };
  const membersLoading = false;
  const uniqueMessages = messages.filter(
    (message, index, self) =>
      index === self.findIndex((m) => m.id === message.id)
  );

  return (
    <div className={styles.chatArea}>
      <div className={styles.chatHeader}>
        <div className={styles.chatInfo}>
          <h2 className={styles.chatTitle}>
            <span className={styles.groupPrefix}>
              <img src={hash} style={{ marginRight: "8px" }} />
            </span>
            {groupData?.name || "Groups"} Group
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
      </div>
      <div className={styles.nomessagecontainer}>
        <h2>
          <span>
            <img src={hash} alt="Group icon" />
          </span>
          {groupData?.name || "Groups"} Group
        </h2>
        <p>
          @Fahad Jalal created this group on January 3rd. This is the very
          beginning of the {groupData?.name} Group
        </p>
      </div>

      <div className={styles.messagesList}>
        {isLoading ? (
          <div className={styles.loading}>Loading messages...</div>
        ) : (
          uniqueMessages
            .slice()
            .reverse()
            .map((message: any) => (
              <MessageComponent key={message.id} message={message} />
            ))
        )}
      </div>

      <TextEditor onSendMessage={handleSendMessage} textTo={groupData?.name} />
    </div>
  );
}
