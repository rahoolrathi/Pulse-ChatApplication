"use client";

import React, { useState, useRef } from "react";
import Sidebar from "../Sidebar";
import { QLURecruiting } from "../QLURecruiting";
import DirectChat from "../DirectChat";
import styles from "./style.module.scss";
import TopSearch from "../TopSearch";
import Splash from "../Splash";
import GroupsView from "../GroupsView";
import GroupChat from "../GroupChat";

interface Members {
  id: string;
  profile_picture: string;
  display_name: string;
}
interface ChatData {
  id: string;
  name: string;
  avatar_url?: string;
  type: "group" | "direct";
  members?: Members[];
}

type ViewType = "splash" | "groups" | "directChat" | "groupChat";

export default function ChatShell() {
  const [activeView, setActiveView] = useState<ViewType>("splash");
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);

  // Ref to store latest refresh function
  const refreshChatsRef = useRef<() => void>(() => {});

  const handleRegisterRefresh = (fn: () => void) => {
    refreshChatsRef.current = fn;
  };

  const handleViewChange = (
    view: ViewType,
    chatData: ChatData | null = null
  ) => {
    setActiveView(view);
    if (chatData) setSelectedChat(chatData);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "splash":
        return <Splash />;
      case "groups":
        return <GroupsView onGroupSelect={() => {}} />;
      case "directChat":
        return <DirectChat chatData={selectedChat} />;
      case "groupChat":
        return (
          <GroupChat
            groupData={{
              id: selectedChat.id,
              name: selectedChat.name,
              members: selectedChat.members,
            }}
          />
        );
      default:
        return <Splash />;
    }
  };

  return (
    <main className={styles.main}>
      <TopSearch
        onViewChange={handleViewChange}
        refreshChats={() => refreshChatsRef.current()}
      />

      <Sidebar />
      <QLURecruiting
        onViewChange={handleViewChange}
        registerRefresh={handleRegisterRefresh}
      />
      {renderMainContent()}
    </main>
  );
}
