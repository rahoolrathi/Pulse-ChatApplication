"use client";

import styles from "./style.module.scss";
import { modelClose } from "../../../assets/icons";
import { Button } from "../../ui";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hooks from "../../../hooks";
import ChatShell from "../../ChatShell";

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({
  onClose,
  onSwitchToSignup,
}: LoginModalProps) {
  const { login, isLoading } = hooks.useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);
    setIdentifierError("");
    setPasswordError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError("");
    setIdentifierError("");
  };

  const handleLogin = async () => {
    let hasError = false;

    if (!identifier) {
      setIdentifierError("Email or username is required");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (!hasError) {
      try {
        await login(identifier, password);
        navigate("/chat");
      } catch (error: any) {
        setIdentifierError("Please enter a valid work email.");
        // Show validation error instead of general error
        setPasswordError("Please enter correct password.");
      }
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={modelClose} alt="Close" />
        </button>

        <h1 className={styles.title}>Login</h1>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Email Address / Username"
            value={identifier}
            onChange={handleIdentifierChange}
            className={clsx(styles.input, identifierError && styles.inputError)}
            disabled={isLoading}
          />
          {identifierError && (
            <div className={styles.errorMessage}>{identifierError}</div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={clsx(styles.input, passwordError && styles.inputError)}
            disabled={isLoading}
          />
          {passwordError && (
            <div className={styles.errorMessage}>{passwordError}</div>
          )}
        </div>

        <Button
          className={styles.forgotPassword}
          onClick={handleForgotPassword}
        >
          Forgot password
        </Button>

        <Button
          variant="filled"
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <span className={styles.orText}>or</span>
          <div className={styles.line}></div>
        </div>

        <Button
          variant="outlined"
          className={styles.createAccountButton}
          onClick={onSwitchToSignup}
        >
          Create a new account
        </Button>
      </div>
    </div>
  );
}
