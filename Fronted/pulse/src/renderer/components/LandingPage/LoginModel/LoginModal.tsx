'use client';

import styles from './style.module.scss';
import { modelClose } from '../../../assets/icons';
import { Button } from '../../ui';
import clsx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Adjust path as needed
import ChatShell from '../../ChatShell';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ onClose, onSwitchToSignup }: LoginModalProps) {
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);
    setIdentifierError('');
    setGeneralError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError('');
    setGeneralError('');
  };

  const handleLogin = async () => {
    let hasError = false;
    setGeneralError('');

    if (!identifier) {
      setIdentifierError('Email or username is required');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (!hasError) {
      try {
        await login(identifier, password);
        navigate('/chat');
      } catch (error: any) {
        setGeneralError(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleForgotPassword = () => {
 
    console.log('Forgot password clicked');
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
          {identifierError && <div className={styles.errorMessage}>{identifierError}</div>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={clsx(styles.input, passwordError && styles.inputError)}
            disabled={isLoading}
          />
          {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
        </div>

        <Button className={styles.forgotPassword} onClick={handleForgotPassword}>
          Forgot password
        </Button>
  {generalError && (
          <div className={styles.errorMessage} style={{ marginBottom: '1rem',  color:'red'}}>
            {generalError}
          </div>
        )}

        <Button 
          variant="filled" 
          className={styles.loginButton} 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <span className={styles.orText}>or</span>
          <div className={styles.line}></div>
        </div>

        <Button variant="outlined" className={styles.createAccountButton} onClick={onSwitchToSignup}>
          Create a new account
        </Button>
      </div>
    </div>
  );
}