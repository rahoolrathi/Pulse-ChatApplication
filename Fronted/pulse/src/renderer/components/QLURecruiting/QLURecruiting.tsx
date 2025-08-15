"use client";

import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { useAuth } from "../../context/AuthContext";
import { chatService } from "../../services/chatService";
import { GroupsIcon, arrowBottom, logo } from "../../assets/icons";
import { useChatList } from "../../hooks/useChat";
import { useGroupChatList } from "../../hooks/useChat"; // path to your hook

interface Group {
  id: string;
  name: string;
}

interface User {
  id: string;
  display_name: string;
  profile_picture?: string | null;
}

interface ChatData {
  id: string;
  name: string;
  avatar_url?: string;
  type: "group" | "direct";
}

type ViewType = "splash" | "groups" | "directChat" | "groupChat";

interface QLURecruitingProps {
  onViewChange: (view: ViewType, chatData?: ChatData | null) => void;
  registerRefresh?: (fn: () => void) => void; // optional prop to register refresh function
}

interface PrivateChat {
  partnerId: string;
  partner: User;
  id?: string; // Optional for backward compatibility
  lastMessage?: {
    content: string;
    timestamp: string;
    sender: User;
  };
  unreadCount?: number;
}

export default function QLURecruiting({
  onViewChange,
  registerRefresh,
}: QLURecruitingProps) {
  const { token, user } = useAuth();
  const [isGroupsDropdownOpen, setIsGroupsDropdownOpen] = useState(true);
  const [isDirectDropdownOpen, setIsDirectDropdownOpen] = useState(true);
  const {
    data: groups = [],
    isLoading: groupsLoading,
    refetchGroupChats,
  } = useGroupChatList();

  const {
    chats: privateChats,
    isLoading: loadingChats,
    error: chatError,
    refetch: loadPrivateChats,
  } = useChatList();

  React.useEffect(() => {
    if (registerRefresh) registerRefresh(loadPrivateChats);
    console.log("Registering refresh function");
  }, [registerRefresh, loadPrivateChats]);

  const handleGroupsClick = (): void => {
    onViewChange("groups");
  };

  const toggleGroupsDropdown = (): void => {
    setIsGroupsDropdownOpen(!isGroupsDropdownOpen);
  };

  const toggleDirectDropdown = (): void => {
    setIsDirectDropdownOpen(!isDirectDropdownOpen);
  };

  const handleGroupSelect = (group: Group): void => {
    onViewChange("groupChat", {
      id: group.id,
      name: group.name,
      type: "group",
    });
  };

  const handleUserSelect = (user: User, partnerId: string): void => {
    onViewChange("directChat", {
      id: partnerId,
      name: user.display_name,
      avatar_url: user.profile_picture || undefined,
      type: "direct",
    });
  };

  return (
    <div className={styles.QLURecruiting}>
      <div className={styles.header}>
        <h2 className={styles.title}>QLU Recruiting</h2>
      </div>

      <div className={styles.buttonsWrapper}>
        <button className={styles.sectionButton} onClick={handleGroupsClick}>
          <span className={styles.iconWrapper}>
            <img src={GroupsIcon} alt="Groups Icon" />
          </span>
          <span className={styles.buttonLabel}>Groups</span>
        </button>
      </div>

      <div className={styles.navigation}>
        {/* Groups Dropdown */}
        <div className={styles.navItem} onClick={toggleGroupsDropdown}>
          <span
            className={styles.chevron}
            style={{
              transform: isGroupsDropdownOpen
                ? "rotate(0deg)"
                : "rotate(-90deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <img src={arrowBottom} alt="Chevron" />
          </span>
          <span className={styles.label}>Groups</span>
        </div>

        {isGroupsDropdownOpen && (
          <div className={styles.groupsList}>
            {groupsLoading && <div>Loading groups...</div>}

            {!groupsLoading && groups.length === 0 && <div>No groups yet</div>}

            {!groupsLoading &&
              groups.map((group) => (
                <div
                  key={group.groupId}
                  className={styles.groupItem}
                  onClick={() => handleGroupSelect(group.group)}
                >
                  <span className={styles.groupIcon}>
                    <img src={logo} alt="Group Icon" />
                  </span>
                  <span className={styles.groupName}>{group.group.name}</span>
                </div>
              ))}
          </div>
        )}

        {/* Direct Messages Dropdown */}
        <div className={styles.navItem} onClick={toggleDirectDropdown}>
          <span
            className={styles.chevron}
            style={{
              transform: isDirectDropdownOpen
                ? "rotate(0deg)"
                : "rotate(-90deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <img src={arrowBottom} alt="Chevron" />
          </span>
          <span className={styles.label}>Direct Messages</span>
        </div>

        {isDirectDropdownOpen && (
          <div className={styles.usersList}>
            {loadingChats && <div>Loading chats...</div>}
            {chatError && (
              <div>
                {chatError.message || "Failed to load chats"}
                <button onClick={() => loadPrivateChats()}>Retry</button>
              </div>
            )}
            {!loadingChats && !chatError && privateChats.length === 0 && (
              <div>No chats yet</div>
            )}

            {!loadingChats &&
              privateChats.map((chat) => {
                console.log(chat);
                const partner = chat.partner;
                if (!partner) return null;

                return (
                  <div
                    key={chat.partnerId}
                    className={styles.userItem}
                    onClick={() => handleUserSelect(partner, chat.partnerId)}
                  >
                    <div className={styles.userAvatarContainer}>
                      <div
                        className={styles.userAvatar}
                        style={{
                          background: `url(${partner.profile_picture || logo}) center/cover no-repeat`,
                        }}
                      />
                    </div>
                    <span className={styles.userName}>
                      {partner.display_name}
                    </span>
                    {/* {chat.unreadCount && chat.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>
                        {chat.unreadCount}
                      </span>
                    )
                    } */}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
