import { useState, useEffect, createContext } from "react";
import { userservice } from "../services/userService";
import User from "../types/User";
import { AuthContextType } from "../types/AuthContextType";
declare global {
  interface Window {
    electronAPI: {
      auth: {
        setToken: (token: string) => Promise<void>;
        getToken: () => Promise<string | null>;
        clearToken: () => Promise<void>;
      };
    };
  }
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProfile = async (tokenToUse?: string) => {
    const activeToken = tokenToUse || token;
    console.log("--------------------");
    if (!activeToken) {
      console.log("--------------------notokennninorofile", activeToken);
      return;
    }
    console.log("--------------------", "----------------");
    try {
      const profile = await userservice.getProfile(activeToken);
      console.log(profile);
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await userservice.login(identifier, password);
      console.log("--------------------pppppppppppppppp", data.token);
      setToken(data.token);
      await window.electronAPI.auth.setToken(data.token);
      await refreshProfile(data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    display_name: string,
    username: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      await userservice.signup(email, display_name, username, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  // Load token/profile on first render
  useEffect(() => {
    const loadSessionAuth = async () => {
      try {
        const savedToken = await window.electronAPI.auth.getToken();
        if (savedToken) {
          setToken(savedToken);

          const profile = await userservice.getProfile(savedToken);
          setUser(profile);
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        await window.electronAPI.auth.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        id: user?.id || null,
        token,
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
