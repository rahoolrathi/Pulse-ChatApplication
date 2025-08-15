"use client";

import { Directmessage, Home, More, Notification } from "../../assets/icons";
import ProfileModal from "../ProfileModal";
import styles from "./style.module.scss";
import { useState, useEffect } from "react";

type User = {
  display_name: string;
  username: string;
  email: string;
  status_description: string;
  phone_number: string;
  avatar_url?: string;
};

const API_BASE = "http://localhost:4000";

export default function Sidebar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string>("home"); // Track active nav item

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/profile/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        const apiUser = data.data;
        const avatarUrl = apiUser.profile_picture
          ? `${API_BASE}/${apiUser.profile_picture.replace(/\\/g, "/").replace(/^\/+/, "")}`
          : "";

        setUser({
          display_name: apiUser.display_name || "",
          username: apiUser.username || "",
          email: apiUser.email || "",
          status_description: apiUser.status_description || "",
          phone_number: apiUser.phone_number || "",
          avatar_url: avatarUrl || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUserClick = () => setIsProfileModalOpen(true);
  const handleProfileUpdate = (updatedUser: User) => setUser(updatedUser);

  // Handle nav item clicks
  const handleNavItemClick = (navItem: string) => {
    setActiveNavItem(navItem);
    // Add your navigation logic here
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>P</div>

      <div className={styles.navItems}>
        <button
          className={`${styles.navItemWrapper} ${activeNavItem === "home" ? styles.active : ""}`}
          title="Home"
          onClick={() => handleNavItemClick("home")}
        >
          <div className={styles.navItem}>
            <img src={Home} alt="Home" />
          </div>
          <span className={styles.label}>Home</span>
        </button>

        <button
          className={`${styles.navItemWrapper} ${activeNavItem === "activity" ? styles.active : ""}`}
          title="Activity"
          onClick={() => handleNavItemClick("activity")}
        >
          <div className={styles.navItem}>
            <img src={Notification} alt="Activity" />
          </div>
          <span className={styles.label}>Activity</span>
        </button>

        <button
          className={`${styles.navItemWrapper} ${activeNavItem === "dms" ? styles.active : ""}`}
          title="DMs"
          onClick={() => handleNavItemClick("dms")}
        >
          <div className={styles.navItem}>
            <img src={Directmessage} alt="DMs" />
          </div>
          <span className={styles.label}>DMs</span>
        </button>

        <button
          className={`${styles.navItemWrapper} ${styles["navItem--more"]} ${activeNavItem === "more" ? styles.active : ""}`}
          title="More"
          onClick={() => handleNavItemClick("more")}
        >
          <div className={styles.navItem}>
            <img src={More} alt="More" />
          </div>
          <span className={styles.label}>More</span>
        </button>
      </div>

      <div className={styles.userSection}>
        <button className={styles.addButton}>+</button>
        {user?.avatar_url ? (
          <div
            className={styles.userAvatar}
            style={{ backgroundImage: `url(${user.avatar_url})` }}
            onClick={handleUserClick}
          />
        ) : (
          <span className={styles.userName} onClick={handleUserClick}>
            {user?.display_name || user?.username || "User"}
          </span>
        )}
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}
