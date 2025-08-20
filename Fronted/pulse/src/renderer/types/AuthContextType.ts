import User from "../types/User";
export interface AuthContextType {
  id: string | null;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (
    email: string,
    display_name: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}
