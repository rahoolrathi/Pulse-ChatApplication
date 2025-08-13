'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.scss';
// import Icon from '../Icon';

type Group = {
  id: string;
  name: string;
  description?: string;
  member_count?: number;
};

type User = {
  id: string;
  username: string;
};

type GroupsViewProps = {
  onGroupSelect: (group: Group) => void;
};

const mockUsers: User[] = [
  { id: '1', username: 'Alice' },
  { id: '2', username: 'Bob' },
  { id: '3', username: 'Charlie' },
  { id: '4', username: 'David' },
];

const GroupsView: React.FC<GroupsViewProps> = ({ onGroupSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (selectedUserIds.length === 0) {
      alert('Please select at least one member');
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDescription,
      member_count: selectedUserIds.length,
    };

    setGroups((prev) => [...prev, newGroup]);
    setGroupName('');
    setGroupDescription('');
    setSelectedUserIds([]);
    setShowModal(false);
    setShowUserDropdown(false);
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setGroupName('');
    setGroupDescription('');
    setSelectedUserIds([]);
    setShowUserDropdown(false);
  };

  return (
    <div className={styles.groupsView}>
      <div className={styles.header}>
        <h2 className={styles.title}>Groups</h2>
        <button className={styles.createButton} onClick={() => setShowModal(true)}>
          {/* <Icon name="plus" /> */}
          <span>Create New Group</span>
        </button>
      </div>

      <div className={styles.groupsList}>
        {groups.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No groups found. Create your first group!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className={styles.groupCard} onClick={() => onGroupSelect(group)}>
              <div className={styles.groupInfo}>
                <span className={styles.groupName}>{group.name}</span>
                {group.description && (
                  <span className={styles.groupDescription}>{group.description}</span>
                )}
                {group.member_count && (
                  <span className={styles.memberCount}>{group.member_count} members</span>
                )}
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
                {/* <Icon name={'modalclose'} /> */}
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
                        ? mockUsers
                            .filter((u) => selectedUserIds.includes(u.id))
                            .map((u) => u.username)
                            .join(', ')
                        : 'Select members'}
                    </div>
                    {/* <Icon name="chevrondown" /> */}
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

                      {mockUsers
                        .filter((u) =>
                          u.username.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((user) => (
                          <label key={user.id} className={styles.checkboxOption}>
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
                    {selectedUserIds.length !== 1 ? 's' : ''} selected
                  </small>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.saveButton}
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedUserIds.length === 0}
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
