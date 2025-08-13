import React, { useState } from 'react';
import styles from './style.module.scss';
import {
  Groupicon,
  GroupsIcon,
  Directmessage,
  arrowBottom,
  logo
} from '../../assets/icons'; 

interface Group {
  id: string;
  name: string;
}

interface User {
  id: string;
  display_name: string;
  avatar_url: string;
}

interface ChatData {
  id: string;
  name: string;
  avatar_url?: string;
  type: 'group' | 'direct';
}

type ViewType = 'splash' | 'groups' | 'directChat' | 'groupChat';

interface QLURecruitingProps {
  onViewChange: (view: ViewType, chatData?: ChatData | null) => void;
}

export default function QLURecruiting({ onViewChange }: QLURecruitingProps) {
  const [isGroupsDropdownOpen, setIsGroupsDropdownOpen] = useState(true);
  const [isDirectDropdownOpen, setIsDirectDropdownOpen] = useState(true);

  const groups = [
    { id: '1', name: 'Group One' },
    { id: '2', name: 'Group Two' },
  ];

  const users = [
    { id: 'a', display_name: 'Alice', avatar_url: '' },
    { id: 'b', display_name: 'Bob', avatar_url: '' },
  ];

  const handleGroupsClick = (): void => {
    console.log('Groups clicked');
    onViewChange('groups');
  };

  const handleDirectClick = () => console.log('Direct Messages clicked');

  const toggleGroupsDropdown = (): void => {
    console.log('Toggle groups dropdown');
    setIsGroupsDropdownOpen(!isGroupsDropdownOpen);
  };

  const toggleDirectDropdown = (): void => {
    console.log('Toggle direct dropdown');
    setIsDirectDropdownOpen(!isDirectDropdownOpen);
  };

  const handleGroupSelect = (group: Group): void => {
    console.log('Selected group:', group);
    onViewChange('groupChat', {
      id: group.id,
      name: group.name,
      type: 'group'
    });
  };

  const handleUserSelect = (user: User): void => {
    console.log('Selected user:', user);
    onViewChange('directChat', {
      id: user.id,
      name: user.display_name,
      avatar_url: user.avatar_url,
      type: 'direct'
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

        <button className={styles.sectionButton} onClick={handleDirectClick}>
          <span className={styles.iconWrapper}>
            <img src={Directmessage} alt="Direct Message Icon" />
          </span>
          <span className={styles.buttonLabel}>Direct Messages</span>
        </button>
      </div>

      <div className={styles.navigation}>
        <div className={styles.navItem} onClick={toggleGroupsDropdown}>
          <span 
            className={styles.chevron}
            style={{ 
              transform: isGroupsDropdownOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <img src={arrowBottom} alt="Chevron" />
          </span>
          <span className={styles.label}>Groups</span>
        </div>

        {isGroupsDropdownOpen && (
          <div className={styles.groupsList}>
            {groups.map((group) => (
              <div
                key={group.id}
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

        <div className={styles.navItem} onClick={toggleDirectDropdown}>
          <span 
            className={styles.chevron}
            style={{ 
              transform: isDirectDropdownOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <img src={arrowBottom} alt="Chevron" />
          </span>
          <span className={styles.label}>Direct Messages</span>
        </div>

        {isDirectDropdownOpen && (
          <div className={styles.usersList}>
            {users.map((user) => (
              <div
                key={user.id}
                className={styles.userItem}
                onClick={() => handleUserSelect(user)}
              >
                <div className={styles.userAvatarContainer}>
                  <div
                    className={styles.userAvatar}
                    style={{
                      background: `url(${user.avatar_url || logo}) center/cover no-repeat`,
                    }}
                  />
                </div>
                <span className={styles.userName}>{user.display_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}