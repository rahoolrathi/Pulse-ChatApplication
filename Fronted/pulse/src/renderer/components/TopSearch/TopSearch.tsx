import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { chatService } from "../../services/chatService";
import "./TopSearch.scss"; // We'll create this interface

interface UserResult {
  id: string;
  username: string;
  display_name: string;
  profile_picture: string | null;
}
interface ChatData {
  id: string;
  name: string;
  avatar_url?: string;
  type: "group" | "direct";
}

interface TopSearchProps {
  placeholder?: string;
  onViewChange?: (view: "directChat", chatData: ChatData) => void;
  refreshChats?: () => void; // new
}

const TopSearch: React.FC<TopSearchProps> = ({
  placeholder = "Search QLU Recruiting",
  onViewChange,
  refreshChats,
}) => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch users when searchTerm changes
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      if (searchTerm.trim() === "") {
        setFilteredUsers([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const users = await chatService.searchUsers(token, searchTerm);
        setFilteredUsers(users);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching users:", error);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = async (user: UserResult) => {
    setShowDropdown(false);
    setSearchTerm(user.display_name || user.username);

    try {
      if (!token) return;

      // Call backend to create/open chat
      const chat = await chatService.createDirectChat(token, user.id);
      if (refreshChats) refreshChats();
      if (onViewChange) {
        onViewChange("directChat", {
          id: chat.id,
          name: chat.name,
          avatar_url: chat.avatar_url,
          type: "direct",
        });
      }
    } catch (error) {
      console.error("Error creating direct chat:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="top-search-bar">
      <div className="search-container" ref={searchRef}>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm && setShowDropdown(true)}
        />

        {showDropdown && (
          <div className="search-dropdown">
            {loading ? (
              <div className="dropdown-loading">Loading...</div>
            ) : filteredUsers.length > 0 ? (
              <>
                <div className="dropdown-header">
                  {filteredUsers.length} result
                  {filteredUsers.length !== 1 ? "s" : ""} found
                </div>
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="user-item"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="user-avatar">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.display_name}
                        />
                      ) : (
                        (user.display_name || user.username)
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>
                    <div className="user-info">
                      <div className="user-name">
                        {user.display_name || user.username}
                      </div>
                      <div className="user-username">@{user.username}</div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="no-results">
                No users found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSearch;
