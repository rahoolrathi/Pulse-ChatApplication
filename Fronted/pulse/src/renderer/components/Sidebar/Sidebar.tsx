'use client';


import { Directmessage, Home, More, Notification,logo} from '../../assets/icons';

import ProfileModal from '../ProfileModal';

import styles from './style.module.scss';
import { useState } from 'react';


export default function Sidebar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
const handleUserClick = () => {
    setIsProfileModalOpen(true);
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>P</div>

      <div className={styles.navItems}>
        <button className={styles.navItemWrapper} title="Home">
          <div className={styles.navItem}>
            <img src={Home} alt="Home" />
          </div>
          {/* <span className={styles.label}>Home</span> */}
        </button>

        <button className={styles.navItemWrapper} title="Activity">
          <div className={styles.navItem}>
            <img src={Notification} alt="Activity" />
          </div>
          {/* <span className={styles.label}>Activity</span> */}
        </button>

        <button className={styles.navItemWrapper} title="DMs">
          <div className={styles.navItem}>
            <img src={Directmessage} alt="DMs" />
          </div>
          {/* <span className={styles.label}>DMs</span> */}
        </button>

        <button
          className={`${styles.navItemWrapper} ${styles['navItem--more']}`}
          title="More"
        >
          <div className={styles.navItem}>
            <img src={More} alt="More" />
          </div>
          <span className={styles.label}>More</span>
        </button>
      </div>

   <div className={styles.userSection}>
        <button className={styles.addButton}>+</button>
        {logo ? (
          <div
            className={styles.userAvatar}
            style={{
              backgroundImage: `url(${logo})`,
            }}
            onClick={handleUserClick}
          />
        ) : (
          <span className={styles.userName} onClick={handleUserClick}>
            {"jhon"}
          </span>
        )}
      </div>


      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

    </div>
  );
}

