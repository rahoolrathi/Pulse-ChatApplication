"use client";

import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import { Button } from "../ui";
import { modelClose } from "../../assets/icons";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onProfileUpdate: (updatedUser: User) => void;
};

type User = {
  display_name: string;
  username: string;
  email: string;
  status_description: string;
  phone_number: string;
  avatar_url?: string;
};

const API_BASE = "http://localhost:4000";

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData(user);
      setPreviewUrl(user.avatar_url || "");
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
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

  const handleSaveUpdatedDetails = async (isProfile: boolean) => {
    if (!formData) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No auth token found");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      if (isProfile) {
        // Profile fields
        if (formData.display_name?.trim()) {
          form.append("display_name", formData.display_name);
        }
        if (formData.username?.trim()) {
          form.append("username", formData.username);
        }
        if (formData.status_description?.trim()) {
          form.append("status_description", formData.status_description);
        }
        if (avatarFile) {
          form.append("profile_picture", avatarFile);
        }
      } else {
        // Contact fields
        if (formData.phone_number?.trim()) {
          form.append("phone_number", formData.phone_number);
        }
        if (formData.email?.trim()) {
          form.append("email", formData.email);
        }
      }

      console.log("FormData entries:");
      for (let [key, value] of form.entries()) {
        console.log(key, value);
      }

      const res = await fetch(`http://localhost:4000/api/profile/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Server response:", data);
        throw new Error(data.error || "Failed to update profile");
      }

      const avatarUrl = data.data.profile_picture
        ? `${API_BASE}/${data.data.profile_picture.replace(/\\/g, "/").replace(/^\/+/, "")}`
        : "";

      const updatedUser: User = {
        display_name: data.data.display_name || "",
        username: data.data.username || "",
        email: data.data.email || "",
        phone_number: data.data.phone_number || "",
        status_description: data.data.status_description,
        avatar_url: avatarUrl,
      };

      // Update both local state and parent component
      setFormData(updatedUser);
      onProfileUpdate(updatedUser); // This updates the sidebar

      if (isProfile) {
        setPreviewUrl(avatarUrl);
        setAvatarFile(null);
        setIsEditing(false);
      } else {
        setShowContactModal(false);
      }
    } catch (err) {
      console.error("Error updating details:", err);
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = () => {
    setPreviewUrl("");
    setAvatarFile(null);
  };

  if (!isOpen || !user) return null;

  const shouldCenter = isEditing || showContactModal;

  return (
    <div
      className={`${styles.modalOverlay} ${shouldCenter ? styles.centered : ""}`}
    >
      <div className={styles.modalContainer}>
        {/* Profile View */}
        {!isEditing && !showContactModal && (
          <div className={styles.profileSection}>
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <span className={styles.title}>Profile</span>
                <button className={styles.closeButton} onClick={onClose}>
                  <img src={modelClose} alt="close model" />
                </button>
              </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.profileImage}>
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              ) : (
                <div className={styles.placeholderImage}></div>
              )}
            </div>

            <div className={styles.userInfo}>
              <div className={styles.nameSection}>
                <span className={styles.displayName}>{user.display_name}</span>
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>

              <div className={styles.usernameSection}>
                <span className={styles.username}>@{user.username}</span>
              </div>

              <div className={styles.statusSection}>
                <p className={styles.statusText}>{user.status_description}</p>
              </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.contactInfo}>
              <div className={styles.emailSection}>
                <span className={styles.label}>Email Address</span>
                <span className={styles.value}>{user.email}</span>
                <button
                  className={styles.editButton}
                  onClick={() => setShowContactModal(true)}
                >
                  Edit
                </button>
              </div>

              <div className={styles.contactSection}>
                <span className={styles.label}>Contact Number</span>
                <span className={styles.value}>{user.phone_number}</span>
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
                <button
                  className={styles.closeButton}
                  onClick={() => setIsEditing(false)}
                >
                  <img src={modelClose} alt="close model" />
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
                    value={formData?.display_name || ""}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData?.username || ""}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Status</label>
                  <textarea
                    name="status_description"
                    value={formData?.status_description || ""}
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
                        style={{ display: "none" }}
                      />
                    </label>

                    <button
                      className={styles.removeButton}
                      onClick={removePhoto}
                    >
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
                onClick={() => handleSaveUpdatedDetails(true)}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
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
                <button
                  className={styles.closeButton}
                  onClick={() => setShowContactModal(false)}
                >
                  <img src={modelClose} alt="close model" />
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
                  value={formData?.email || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>Contact number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData?.phone_number || ""}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.addInfoSection}>
                <span className={styles.addInfo}>+ Add information</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                onClick={() => handleSaveUpdatedDetails(false)}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
