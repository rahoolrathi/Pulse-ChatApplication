import { getAuthHeaders } from "../utils/helper";
import User from "../types/User";
import { urlToDbPath } from "../utils/helper";
class userService {
  private pURL = "http://localhost:4000/api/public/";
  private prURL = "http://localhost:4000/api/private/";
  async login(identifier: string, password: string) {
    const res = await fetch(`${this.pURL}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed");
    return data.data;
  }

  async signup(
    email: string,
    display_name: string,
    username: string,
    password: string
  ) {
    const res = await fetch(`${this.pURL}auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, display_name, username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");

    return data;
  }

  async getProfile(token: string) {
    const res = await fetch(`${this.prURL}profile/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const json = await res.json();

    // ✅ Unwrap the double-nested data
    const profile = json?.data?.data;
    if (!profile) {
      throw new Error("Invalid profile response");
    }

    // ✅ Normalize the profile picture path
    return profile;
  }

  async getAllUsers(token: string): Promise<User[]> {
    try {
      const response = await fetch(`${this.prURL}profile/allprofile`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch users");
      }

      const users: User[] = result.data;
      console.log("users response:", users);

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async editProfile(formData: FormData, token: string): Promise<User> {
    const res = await fetch(`${this.prURL}profile/edit`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server returned no JSON");
    }

    if (!res.ok) {
      console.error("Server response:", data);
      throw new Error(data?.error || "Failed to update profile");
    }

    const avatarUrl = data.data.profile_picture
      ? urlToDbPath(data.data.profile_picture)
      : "";

    return {
      id: data.data.id,
      display_name: data.data.display_name || "",
      username: data.data.username || "",
      email: data.data.email || "",
      phone_number: data.data.phone_number || "",
      status_description: data.data.status_description,
      profile_picture: avatarUrl,
    };
  }

  async searchUser(token: string, key: string): Promise<User[]> {
    if (!key) throw new Error("Search key is required");

    const res = await fetch(
      `${this.prURL}profile/search?key=${encodeURIComponent(key)}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
      }
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.error || "Failed to search users");
    }

    const json = await res.json();
    console.log(";;;;;;;;", json);
    // Ensure json.data exists and is an array
    // if (!json?.data || !Array.isArray(json.data)) return [];

    // Normalize profile_picture paths
    return json.map((user: any) => ({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      profile_picture: user.profile_picture
        ? urlToDbPath(user.profile_picture)
        : "",
    }));
  }
}
export const userservice = new userService();
