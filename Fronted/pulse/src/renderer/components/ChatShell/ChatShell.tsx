'use client';

import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import {QLURecruiting} from '../QLURecruiting'
import DirectChat from '../DirectChat';
import styles from './style.module.scss';
import TopSearch from '../TopSearch';
import Splash from '../Splash';
import GroupsView from '../GroupsView';
import GroupChat from '../GroupChat';

interface ChatData {
  id: string;
  name: string;
  avatar_url?: string;
  type: 'group' | 'direct';
}

type ViewType = 'splash' | 'groups' | 'directChat' | 'groupChat';

export default function ChatShell() {
const [activeView, setActiveView] = useState<ViewType>('splash');
const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
 const handleGroupSelect = (group:any) => {
    console.log('Selected group:', group);
    // You can set selected group in state, navigate, etc.
  };
  const handleViewChange = (view: ViewType, chatData: ChatData | null = null) => {
    setActiveView(view);
    if (chatData) {
      setSelectedChat(chatData);
    }
  };
  const renderMainContent = () => {
    switch (activeView) {
      case 'splash':
        return <Splash />;
      case 'groups':
        return   <GroupsView onGroupSelect={handleGroupSelect} />
      case 'directChat':
        return <DirectChat chatData={selectedChat} />;
      case 'groupChat':
          return <GroupChat groupId='1'/>;
      default:
        return <Splash />;
    }
  };

  return (
    <main className={styles.main}>
      <TopSearch />
      <Sidebar />
      <QLURecruiting onViewChange={handleViewChange} />
      {renderMainContent()}
    </main>
  );
}