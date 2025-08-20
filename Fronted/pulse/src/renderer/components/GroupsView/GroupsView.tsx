"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./style.module.scss";
import { chatService } from "../../services/chatService";
import { GroupChatBox } from "../../types";
import hooks from "../../hooks";
import { selectorarrow, modelClose } from "../../assets/icons";
// // Interfaces
// export interface GroupMember {
//   groupId: string;
//   userId: string;
//   role: "admin" | "member";
//   joinedAt: string;
//   user: {
//     id: string;
//     display_name: string;
//     profile_picture: string | null;
//   };
// }
// export interface GroupResponse {
//   id: string;
//   name: string;
//   description?: string;
//   createdBy: string;
//   createdAt: string;
//   members: GroupMember[];
// }

// export interface User {
//   id: string;
//   username: string;
//   display_name: string;
//   profile_picture?: string | null;
// }
// interface Members {
//   id: string;
//   profile_picture: string;
//   display_name: string;
// }
// interface GroupChatBox {
//   groupId: string;
//   name: string;
//   members: Members[];
// }
interface GroupsViewProps {
  onGroupSelect: (group: GroupChatBox) => void;
}

const GroupsView: React.FC<GroupsViewProps> = ({ onGroupSelect }) => {
  const { token } = hooks.useAuth();
  const { data: users = [], isLoading: usersLoading } = hooks.useAllUsers();
  const {
    data: groups = [],
    isLoading: groupsLoading,
    refetchGroupChats,
  } = hooks.useGroupChatList();

  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("hii");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    if (selectedUserIds.length === 0) {
      alert("Please select at least one member");
      return;
    }

    if (!token) {
      alert("You are not authenticated");
      return;
    }

    try {
      await chatService.createGroup(
        token,
        groupName,
        groupDescription,
        selectedUserIds
      );

      // Refetch the group list after creating a new group
      refetchGroupChats();

      setGroupName("");
      setGroupDescription("hii");
      setSelectedUserIds([]);
      setShowModal(false);
      setShowUserDropdown(false);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group");
    }
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setGroupName("");
    setGroupDescription("");
    setSelectedUserIds([]);
    setShowUserDropdown(false);
  };

  return (
    <div className={styles.groupsView}>
      <div className={styles.header}>
        <h2 className={styles.title}>Groups</h2>
        <button
          className={styles.createButton}
          onClick={() => setShowModal(true)}
        >
          <span>Create New Group</span>
        </button>
      </div>

      <div className={styles.groupsList}>
        {groupsLoading ? (
          <p>Loading groups...</p>
        ) : groups.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No groups found. Create your first group!</p>
          </div>
        ) : (
          groups.map((group: any) => (
            <div
              key={group.groupId}
              className={styles.groupCard}
              onClick={() => onGroupSelect(group)}
            >
              <div className={styles.groupInfo}>
                <span className={styles.groupName}>{group.name}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Create New Group</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <img
                  src={modelClose}
                  alt="Close"
                  className={styles.closeButton}
                />
              </button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.modalBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.groupNameLabel}>Group Name *</label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Select Members *</label>
                <div ref={dropdownRef}>
                  <div
                    className={styles.customSelect}
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                  >
                    <div className={styles.selected}>
                      {selectedUserIds.length
                        ? users
                            .filter((u: any) => selectedUserIds.includes(u.id))
                            .map((u: any) => u.username)
                            .join(", ")
                        : "Select members"}
                    </div>
                    <img
                      src={selectorarrow} // from your imported assets
                      alt="arrow"
                      className={styles.arrowIcon}
                    />
                  </div>

                  {showUserDropdown && (
                    <div className={styles.dropdown}>
                      <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                        autoFocus
                      />

                      {users
                        .filter((u: any) =>
                          u.username
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((user: any) => (
                          <label
                            key={user.id}
                            className={styles.checkboxOption}
                          >
                            <input
                              type="checkbox"
                              checked={selectedUserIds.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                            {user.username}
                          </label>
                        ))}
                    </div>
                  )}
                </div>
                {selectedUserIds.length > 0 && (
                  <small className={styles.selectedCount}>
                    {selectedUserIds.length} member
                    {selectedUserIds.length !== 1 ? "s" : ""} selected
                  </small>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.saveButton}
                onClick={handleCreateGroup}
                disabled={
                  !groupName.trim() ||
                  selectedUserIds.length === 0 ||
                  usersLoading
                }
              >
                Create Group
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsView;
