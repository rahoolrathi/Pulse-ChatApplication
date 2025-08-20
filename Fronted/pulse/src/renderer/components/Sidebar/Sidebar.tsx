"use client";

import { Directmessage, Home, More, Notification } from "../../assets/icons";
import ProfileModal from "../ProfileModal";
import styles from "./style.module.scss";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { logo } from "../../assets/icons";
import { dbPathToUrl } from "../../utils/helper";

export default function Sidebar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("home");
  const { user, refreshProfile } = useAuth();

  const handleUserClick = () => setIsProfileModalOpen(true);
  const handleProfileUpdate = () => refreshProfile();

  // Use dbPathToUrl if profile_picture exists, otherwise default to logo
  const avatar = user?.profile_picture
    ? dbPathToUrl(user.profile_picture)
    : logo;

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>P</div>

      <div className={styles.navItems}>
        {[
          { id: "home", icon: Home, label: "Home" },
          { id: "activity", icon: Notification, label: "Activity" },
          { id: "dms", icon: Directmessage, label: "DMs" },
          { id: "more", icon: More, label: "More" },
        ].map((item) => (
          <button
            key={item.id}
            className={`${styles.navItemWrapper} ${
              activeNavItem === item.id ? styles.active : ""
            }`}
            title={item.label}
            onClick={() => setActiveNavItem(item.id)}
          >
            <div className={styles.navItem}>
              <img src={item.icon} alt={item.label} />
            </div>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.userSection}>
        <button className={styles.addButton}>+</button>
        <div
          className={styles.userAvatar}
          style={{ backgroundImage: `url(${avatar})` }}
          onClick={handleUserClick}
        />
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
