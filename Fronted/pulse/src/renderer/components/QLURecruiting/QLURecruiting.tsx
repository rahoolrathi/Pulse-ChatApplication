"use client";

import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { useAuth } from "../../hooks/useAuth";
import hooks from "../../hooks"; // path to your hook
import { GroupsIcon, arrowBottom, logo, chat } from "../../assets/icons";
import { ChatData, GroupChatBox } from "../../types";
import User from "../../types/User";
import { dbPathToUrl } from "../../utils/helper"; // helper functions

type ViewType = "splash" | "groups" | "directChat" | "groupChat";

interface QLURecruitingProps {
  onViewChange: (view: ViewType, chatData?: ChatData | null) => void;
  registerRefresh?: (fn: () => void) => void;
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
  } = hooks.useGroupChatList();

  const {
    chats: privateChats,
    isLoading: loadingChats,
    error: chatError,
    refetch: loadPrivateChats,
  } = hooks.useChatList();

  // useEffect(() => {
  //   console.log("Registering refresh function");
  // }, [registerRefresh, loadPrivateChats]);

  const handleGroupsClick = (): void => {
    onViewChange("groups");
  };

  const toggleGroupsDropdown = (): void => {
    setIsGroupsDropdownOpen(!isGroupsDropdownOpen);
  };

  const toggleDirectDropdown = (): void => {
    setIsDirectDropdownOpen(!isDirectDropdownOpen);
  };

  const handleGroupSelect = (group: GroupChatBox): void => {
    onViewChange("groupChat", {
      id: group.groupId,
      name: group.name,
      members: group.members,
      type: "group",
    });
  };

  const handleUserSelect = (user: User): void => {
    onViewChange("directChat", {
      id: user.id,
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
      <div className={styles.buttonsWrapper}>
        <button className={styles.sectionButton}>
          <span className={styles.iconWrapper}>
            <img src={chat} alt="chat icon" />
          </span>
          <span className={styles.buttonLabel}>Direct Messages</span>
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

            {!groupsLoading &&
              groups.map((group: any) => (
                <div
                  key={group.groupId}
                  className={styles.groupItem}
                  onClick={() => handleGroupSelect(group)}
                >
                  <span className={styles.groupIcon}>
                    <img src={logo} alt="Group Icon" />
                  </span>
                  <span className={styles.groupName}>{group.name}</span>
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
            {/* {!loadingChats && !chatError && privateChats.length === 0 && (
              <div>No chats yet</div>
            )} */}

            {!loadingChats &&
              privateChats.map((chat) => {
                if (!chat) return null;

                return (
                  <div
                    key={chat.id}
                    className={styles.userItem}
                    onClick={() => handleUserSelect(chat)}
                  >
                    <div className={styles.userAvatarContainer}>
                      <div
                        className={styles.userAvatar}
                        style={{
                          background: chat.profile_picture
                            ? `url(${dbPathToUrl(chat.profile_picture)}) center/cover no-repeat`
                            : `url(${logo}) center/cover no-repeat`,
                        }}
                      />
                    </div>
                    <span className={styles.userName}>{chat.display_name}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
