'use client';

import React, { useState, useRef } from 'react';
import {
  italicIcon,
  boldIcon,
  link,
  dotList,
  alignLeft,
  seperator,
  leftarrow,
  rightarrow,
  roundadd,
  alpha,
  smile,
  video,
  mic,
  square,
  send,
} from '../../assets/icons'; // adjust paths as needed
import styles from './style.module.scss';

type TextEditorProps = {
  textTo?: string;
};

const TextEditor: React.FC<TextEditorProps> = ({ textTo }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setShowModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

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
            <img src={seperator} alt="Code icon" />
          </button>
        </div>

        <div className={styles.messageInput}>
          {!isFocused && !message && !previewUrl && (
            <div className={styles.placeholder}>Message {textTo}</div>
          )}
          <textarea
            className={styles.inputField}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            rows={1}
            disabled={!!imageFile}
          />
        </div>

        {previewUrl && (
          <div className={styles.imageIndicator}>
            <div className={styles.imageInfo} onClick={handleImageClick}>
              <span>📎 Image attached - Click to preview</span>
            </div>
            <button onClick={handleClearImage} className={styles.clearImageButton}>
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
              disabled={!!message.trim()}
            >
              <img src={roundadd} alt="Attach media" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={!!message.trim()}
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
            <div className={styles.separator} />
            <button className={styles.toolButton} title="Video">
              <img src={video} alt="Video icon" />
            </button>
            <button className={styles.toolButton} title="Mic">
              <img src={mic} alt="Mic icon" />
            </button>
            <div className={styles.separator} />
            <button className={styles.attachButton} title="Attach" />
          </div>

          <button className={styles.sendButton} title="Send">
            <img src={send} alt="Send icon" />
          </button>
        </div>
      </div>

      {showModal && previewUrl && (
        <div className={styles.modal} onClick={handleModalClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleModalClose}>
              ✕
            </button>
            <img
              src={previewUrl}
              alt="Preview"
              className={styles.modalImage}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
