"use client";

import styles from "./style.module.scss";
import { modelClose } from "../../../assets/icons";
import { Button } from "../../ui";
import { useState } from "react";
import clsx from "clsx";
import hooks from "../../../hooks"; // Adjust path as needed

interface SignupModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({
  onClose,
  onSwitchToLogin,
}: SignupModalProps) {
  const { signup, isLoading } = hooks.useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateUsername = (username: string) =>
    /^[a-zA-Z0-9_]{3,}$/.test(username);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      value && !validateEmail(value)
        ? "Please enter a valid email address."
        : ""
    );
    setGeneralError("");
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: "", color: "" };
    if (password.length < 8) return { strength: "Weak", color: "weakBar" };
    if (password.length < 12) return { strength: "Medium", color: "mediumBar" };
    return { strength: "Strong", color: "strongBar" };
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(
      value && !validateUsername(value)
        ? "Username unavailable. Try using numbers, underscores etc."
        : ""
    );
    setGeneralError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError("");
    setGeneralError("");
  };

  const handleSignup = async () => {
    let hasError = false;
    setGeneralError("");

    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!username || !validateUsername(username)) {
      setUsernameError("Username unavailable.");
      hasError = true;
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (!hasError) {
      try {
        await signup(email, displayName, username, password);
        setShowConfirmation(true);
      } catch (error: any) {
        setGeneralError(error.message || "Signup failed. Please try again.");
      }
    }
  };

  const passwordStrengthInfo = getPasswordStrength(password);

  if (showConfirmation) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={onClose}>
            <img src={modelClose} alt="Close" />
          </button>
          <div className={styles.confirmationContent}>
            <div className={styles.emailIcon}>
              <div className={styles.envelope}></div>
            </div>
            <h2 className={styles.confirmationTitle}>
              Thanks! We have sent a confirmation email to {email}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={modelClose} alt="Close" />
        </button>

        <h1 className={styles.title}>Signup</h1>

        {generalError && (
          <div className={styles.errorMessage} style={{ marginBottom: "1rem" }}>
            {generalError}
          </div>
        )}

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email Address"
            className={clsx(styles.input, emailError && styles.inputError)}
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
          />
          {emailError && (
            <div className={styles.errorMessage}>{emailError}</div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Display Name"
            className={styles.input}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Username"
            className={clsx(styles.input, usernameError && styles.inputError)}
            onChange={handleUsernameChange}
            value={username}
            disabled={isLoading}
          />
          {usernameError && (
            <div className={styles.errorMessage}>{usernameError}</div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            className={clsx(styles.input, passwordError && styles.inputError)}
            onChange={handlePasswordChange}
            value={password}
            disabled={isLoading}
          />
          {passwordError && (
            <div className={styles.errorMessage}>{passwordError}</div>
          )}
        </div>

        {password && passwordStrengthInfo.strength && (
          <div className={styles.passwordStrength}>
            <div className={styles.strengthIndicator}>
              {[0, 1, 2].map((index) => {
                const strength = passwordStrengthInfo.strength;
                const barClass =
                  (index === 0 && strength) ||
                  (index === 1 &&
                    (strength === "Medium" || strength === "Strong")) ||
                  (index === 2 && strength === "Strong")
                    ? styles[passwordStrengthInfo.color as keyof typeof styles]
                    : styles.grayBar;

                return (
                  <div
                    key={index}
                    className={clsx(styles.strengthBar, barClass)}
                  />
                );
              })}
            </div>
            <span className={styles.strengthText}>
              Password strength: {passwordStrengthInfo.strength}
            </span>
          </div>
        )}

        <Button
          variant="filled"
          className={styles.signupButton}
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Signup"}
        </Button>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <span className={styles.orText}>or</span>
          <div className={styles.line}></div>
        </div>

        <Button
          variant="outlined"
          className={styles.loginRedirectButton}
          onClick={onSwitchToLogin}
        >
          Already have an account? Login
        </Button>
      </div>
    </div>
  );
}
