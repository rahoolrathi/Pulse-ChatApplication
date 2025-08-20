// services/apiService.ts
import { getAuthHeaders } from "../utils/helper";

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

class ApiService {
  private baseURL = "http://localhost:4000/api";

  private async getToken(): Promise<string | null> {
    try {
      return await window.electronAPI.auth.getToken();
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  async publicRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/public/${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Request failed with status ${response.status}`
      );
    }

    return data;
  }

  async privateRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login first.");
    }

    const url = `${this.baseURL}/private/${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...getAuthHeaders(token),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Request failed with status ${response.status}`
      );
    }

    return data;
  }

  // Multipart form data request for file uploads
  async privateFormRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const token = await this.getToken();

    if (!token) {
      throw new Error("No authentication token found. Please login first.");
    }

    const url = `${this.baseURL}/private/${endpoint}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,

      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Request failed with status ${response.status}`
      );
    }

    return data;
  }
}

export const apiService = new ApiService();
