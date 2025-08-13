'use client';

import styles from './style.module.scss';
import MessageComponent from '../Message';
import TextEditor from '../TextEditor';
// import { Message } from '../../type';
import { useState } from 'react';

type GroupChatProps = {
  groupId: string;
};

const mockGroup = {
  id: '1',
  name: 'My Mock Group',
  description: 'This is a sample offline group.',
  created_by: 'u1',
  created_at: new Date().toISOString(),
};
type Message = {
  id: string;
  sender_id: string;
  content: string;
  type: string
  created_at: string;
};
const mockCreator = {
  id: 'u1',
  username: 'admin',
  display_name: 'Admin User',
};

const mockMembers = [
  {
    id: 'u1',
    username: 'admin',
    display_name: 'Admin User',
    avatar_url: '',
  },
  {
    id: 'u2',
    username: 'john',
    display_name: 'John Doe',
    avatar_url: '',
  },
  {
    id: 'u3',
    username: 'jane',
    display_name: 'Jane Smith',
    avatar_url: '',
  },
];

export default function GroupChat({ groupId }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender_id: 'u2',
      content: 'Hey everyone!',
      type: 'text',
      created_at: new Date().toISOString(),
    },
    {
      id: 'm2',
      sender_id: 'u3',
      content: 'Hi John!',
      type: 'text',
      created_at: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = (content: string, type: string = 'text') => {
    if (!content.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: mockCreator.id,
      content,
      type,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [newMessage, ...prev]); // newest first
  };

  return (
    <div className={styles.chatArea}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatInfo}>
          <h2 className={styles.chatTitle}>
            <span className={styles.groupPrefix}># </span>
            {mockGroup.name}
          </h2>
          <p className={styles.groupDescription}>
            <span className={styles.createrName}>
              @{mockCreator.username || mockCreator.display_name}
            </span>{' '}
            created this group on {new Date(mockGroup.created_at).toLocaleDateString()}.
            This is the start of the group.
          </p>
        </div>

        {/* Members */}
        <div className={styles.members}>
          {mockMembers.slice(0, 3).map((member, index) => (
            <div
              key={member.id}
              className={styles.memberAvatar}
              title={member.display_name || member.username}
              style={{
                backgroundImage: member.avatar_url ? `url(${member.avatar_url})` : 'none',
                backgroundColor: member.avatar_url ? 'transparent' : '#BCE1FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#08344D',
                fontWeight: 'bold',
                fontSize: '14px',
                zIndex: index + 1,
                marginLeft: index === 0 ? '0' : '-22px',
              }}
            >
              {!member.avatar_url &&
                (member.display_name || member.username).charAt(0).toUpperCase()}
            </div>
          ))}

          <div
            className={styles.memberAvatar}
            style={{
              backgroundColor: '#BCE1FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#08344D',
              fontWeight: 'bold',
              fontSize: '14px',
              zIndex: 6,
              marginLeft: mockMembers.length > 0 ? '-22px' : '0',
            }}
          >
            {mockMembers.length}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesList}>
        {messages.length === 0 ? (
          <div className={styles.empty}>No messages yet</div>
        ) : (
          /*message={message} */
          messages.map((message) => <MessageComponent key={message.id} />)
        )}
      </div>

      {/* Text Input */}
      {/* onSendMessage={handleSendMessage} */}
      <TextEditor  textTo={mockGroup.name} />
    </div>
  );
}
