'use client';

import { useState } from 'react';
import styles from './style.module.scss';
import HeroIllustration from './HeroIllustration';
import { Button } from '../ui';
import LoginModal from './LoginModel';
import SignupModal from './SignupModal';

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false); // Close signup if it's open
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false); // Close login if it's open
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <main className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span>Pulse</span>
          <div className={styles.vector}>
            <svg
              width="40"
              height="22"
              viewBox="0 0 40 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.333333 19C0.333333 20.4728 1.52724 21.6667 3 21.6667C4.47276 21.6667 5.66667 20.4728 5.66667 19C5.66667 17.5272 4.47276 16.3333 3 16.3333C1.52724 16.3333 0.333333 17.5272 0.333333 19ZM11 3L11.3536 2.64645L10.863 2.15592L10.5528 2.77639L11 3ZM27 19L26.6464 19.3536L27.1014 19.8085L27.4299 19.2553L27 19ZM33.8333 3C33.8333 4.47276 35.0272 5.66667 36.5 5.66667C37.9728 5.66667 39.1667 4.47276 39.1667 3C39.1667 1.52724 37.9728 0.333333 36.5 0.333333C35.0272 0.333333 33.8333 1.52724 33.8333 3ZM3.44721 19.2236L11.4472 3.22361L10.5528 2.77639L2.55279 18.7764L3.44721 19.2236ZM10.6464 3.35355L26.6464 19.3536L27.3536 18.6464L11.3536 2.64645L10.6464 3.35355ZM27.4299 19.2553L36.9299 3.25527L36.0701 2.74473L26.5701 18.7447L27.4299 19.2553Z"
                fill="#06334D"
              />
            </svg>
          </div>
        </div>

        <div className={styles.links}>
          <span className={styles.hoverable}>Privacy</span>
          <span>Help Center</span>
          <span>Pulse Web</span>
          <span>Download</span>
          <a href="/chat" className={styles.tryPulse}>
            Try Pulse
          </a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.textContent}>
          <h1>Communicate, Anywhere, Anytime</h1>
          <p>
            Connect effortlessly across all devices with Pulse. Break free from limitations and
            redefine communication, anytime, anywhere.
          </p>

          <div className={styles.ctaButtons}>
            <Button variant="filled" className={styles.signup} onClick={openSignupModal}>
              Signup
            </Button>
            <Button variant="outlined" className={styles.login} onClick={openLoginModal}>
              Login
            </Button>
          </div>
        </div>

        <div className={styles.illustration}>
          <HeroIllustration />
        </div>
      </section>

      <div className={styles.downArrow}>
        <div className={styles.arrow}></div>
        <div className={styles.arrow}></div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal 
          onClose={closeModals} 
          onSwitchToSignup={switchToSignup}
        />
      )}
      {showSignupModal && (
        <SignupModal 
          onClose={closeModals} 
          onSwitchToLogin={switchToLogin}
        />
      )}
    </main>
  );
}