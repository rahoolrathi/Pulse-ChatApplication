"use client";

import React, { useState, useRef } from "react";
import {
  italicIcon,
  boldIcon,
  link,
  dotList,
  alignLeft,
  seperator,
  roundadd,
  alpha,
  smile,
  video,
  mic,
  send,
  teright,
  teleft,
} from "../../assets/icons"; // adjust paths as needed
import styles from "./style.module.scss";
import hooks from "../../hooks";

interface TextEditorProps {
  textTo: string;
  onSendMessage?: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ textTo, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isConnected } = hooks.useSocket();

  // --- Auto-resize & input change ---
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  // --- Send message ---
  const handleSendMessage = () => {
    if ((message.trim() || imageFile) && onSendMessage) {
      if (imageFile) {
        onSendMessage(`📎 ${imageFile.name}`);
        handleClearImage();
      } else {
        onSendMessage(message.trim());
      }
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- File upload ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setShowModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageClick = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <div className={styles.textEditorContainer}>
      <div className={styles.textEditor}>
        <div className={styles.toolbar}>
          <button className={styles.toolbarButton} title="Bold">
            <img src={boldIcon} alt="Bold icon" />
          </button>
          <button className={styles.toolbarButton} title="Italic">
            <img src={italicIcon} alt="Italic icon" />
          </button>
          <button className={styles.toolbarButton} title="Link">
            <img src={link} alt="Link icon" />
          </button>
          <div className={styles.separator} />
          <button className={styles.toolbarButton} title="List">
            <img src={dotList} alt="List icon" />
          </button>
          <button className={styles.toolbarButton} title="Align">
            <img src={alignLeft} alt="Align icon" />
          </button>
          <div className={styles.separator} />
          <button className={styles.toolbarButton} title="Code">
            <img src={teleft} alt="Code icon" />
          </button>
          <button className={styles.toolbarButton} title="Code">
            <img src={teright} alt="Code icon" />
          </button>
        </div>

        <div className={styles.messageInput}>
          {!isFocused && !message && !previewUrl && (
            <div className={styles.placeholder}>Message {textTo}</div>
          )}
          <textarea
            ref={textareaRef}
            className={styles.inputField}
            value={message}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            placeholder=""
            rows={1}
            disabled={!!imageFile || !isConnected}
          />
        </div>

        {previewUrl && (
          <div className={styles.imageIndicator}>
            <div className={styles.imageInfo} onClick={handleImageClick}>
              <span>📎 Image attached - Click to preview</span>
            </div>
            <button
              onClick={handleClearImage}
              className={styles.clearImageButton}
            >
              ✕
            </button>
          </div>
        )}

        <div className={styles.bottomToolbar}>
          <div className={styles.leftTools}>
            <button
              className={styles.expandButton}
              title="Attach Image"
              onClick={triggerFileSelect}
              disabled={!!message.trim() || !isConnected}
            >
              <img src={roundadd} alt="Attach media" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={!!message.trim() || !isConnected}
            />

            <button className={styles.toolButton} title="Italic">
              <img src={italicIcon} alt="Italic icon" />
            </button>
            <button className={styles.toolButton} title="Underline">
              <img src={alpha} alt="Underline icon" />
            </button>
            <button className={styles.toolButton} title="Emoji">
              <img src={smile} alt="Emoji icon" />
            </button>
            <button className={styles.toolButton} title="Mic">
              <img src={seperator} alt="seperator" />
            </button>
            <button className={styles.toolButton} title="Video">
              <img src={video} alt="Video icon" />
            </button>
            <div className={styles.separator}>
              {" "}
              <img src={mic} alt="Mic icon" />
            </div>
            <button className={styles.toolButton} title="Mic">
              <img src={seperator} alt="seperator" />
            </button>

            <button className={styles.attachButton} title="Attach" />
          </div>

          <button
            className={styles.sendButton}
            title="Send"
            onClick={handleSendMessage}
            disabled={(!message.trim() && !imageFile) || !isConnected}
          >
            <img src={send} alt="Send icon" />
          </button>
        </div>
      </div>

      {showModal && previewUrl && (
        <div className={styles.modal} onClick={handleModalClose}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={handleModalClose}>
              ✕
            </button>
            <img
              src={previewUrl}
              alt="Preview"
              className={styles.modalImage}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      )}
      {!isConnected && (
        <div className={styles.connectionToast}>Socket disconnected</div>
      )}
    </div>
  );
};

export default TextEditor;
