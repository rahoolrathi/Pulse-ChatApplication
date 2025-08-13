'use client';

import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import { Button } from '../ui';

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type User = {
  display_name: string;
  username: string;
  email: string;
  status: string;
  contact_number: string;
  avatar_url?: string;
};

const mockUser: User = {
  display_name: 'John Doe',
  username: 'johnny',
  email: 'john@example.com',
  status: 'Living the dream 🌴',
  contact_number: '+1 234 567 890',
  avatar_url: '',
};

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState(mockUser);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(mockUser);
    setFormData(mockUser);
    setPreviewUrl(mockUser.avatar_url || '');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      setUser((prev) => ({ ...prev!, ...formData, avatar_url: previewUrl }));
      setIsEditing(false);
      setAvatarFile(null);
      setLoading(false);
    }, 500);
  };

  const handleSaveContact = () => {
    setLoading(true);
    setTimeout(() => {
      setUser((prev) => ({ ...prev!, email: formData.email, contact_number: formData.contact_number }));
      setShowContactModal(false);
      setLoading(false);
    }, 500);
  };

  const removePhoto = () => {
    setPreviewUrl('');
    setAvatarFile(null);
  };

  if (!isOpen || !user) return null;

  const shouldCenter = isEditing || showContactModal;

  return (
    <div className={`${styles.modalOverlay} ${shouldCenter ? styles.centered : ''}`}>
      <div className={styles.modalContainer}>
        {/* Profile View */}
        {!isEditing && !showContactModal && (
          <div className={styles.profileSection}>
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <span className={styles.title}>Profile</span>
                <button className={styles.closeButton} onClick={onClose}>
                  {/* <Icon name={'modalclose'} /> */}
                </button>
              </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.profileImage}>
              {user.avatar_url ? (
  
                <img src={user.avatar_url} alt="Profile" width={0} height={0} sizes="100vw" />
              ) : (
                <div className={styles.placeholderImage}></div>
              )}
            </div>

            <div className={styles.userInfo}>
              <div className={styles.nameSection}>
                <span className={styles.displayName}>{user.display_name}</span>
                <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              </div>

              <div className={styles.usernameSection}>
                <span className={styles.username}>@{user.username}</span>
              </div>

              <div className={styles.statusSection}>
                <p className={styles.statusText}>{user.status}</p>
              </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.contactInfo}>
              <div className={styles.emailSection}>
                <span className={styles.label}>Email Address</span>
                <span className={styles.value}>{user.email}</span>
                <button className={styles.editButton} onClick={() => setShowContactModal(true)}>
                  Edit
                </button>
              </div>

              <div className={styles.contactSection}>
                <span className={styles.label}>Contact Number</span>
                <span className={styles.value}>{user.contact_number}</span>
              </div>

              <div className={styles.addInfoSection}>
                <span className={styles.addInfo}>+ Add information</span>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile */}
        {isEditing && (
          <div className={styles.editProfile}>
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <span className={styles.title}>Edit your profile</span>
                <button className={styles.closeButton} onClick={() => setIsEditing(false)}>
                  {/* <Icon name={'modalclose'} /> */}
                </button>
              </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.editContent}>
              <div className={styles.leftSection}>
                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Display Name</label>
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Status</label>
                  <textarea
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    rows={5}
                  />
                </div>
              </div>

              <div className={styles.rightSection}>
                <div className={styles.photoSection}>
                  <label className={styles.fieldLabel}>Profile photo</label>
                  <div className={styles.photoContainer}>
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className={styles.photoPreview}
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    ) : (
                      <div className={styles.photoPlaceholder}></div>
                    )}
                  </div>

                  <div className={styles.photoActions}>
                    <label className={styles.uploadButton}>
                      Upload Profile Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <button className={styles.removeButton} onClick={removePhoto}>
                      Remove Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                variant="outlined"
                className={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>

              <Button
                variant="filled"
                className={styles.saveButton}
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>
        )}

        {/* Edit Contact Info */}
        {showContactModal && (
          <div className={styles.contactModal}>
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <span className={styles.title}>Edit contact information</span>
                <button className={styles.closeButton} onClick={() => setShowContactModal(false)}>
                  {/* <Icon name={'modalclose'} /> */}
                </button>
              </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.contactContent}>
              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>Contact number</label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.addInfoSection}>
                <span className={styles.addInfo}>+ Add information</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelButton} onClick={() => setShowContactModal(false)}>
                Cancel
              </button>
              <button className={styles.saveButton} onClick={handleSaveContact} disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
