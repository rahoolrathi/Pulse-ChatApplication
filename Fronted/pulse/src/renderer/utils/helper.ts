export function getAuthHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const API_BASE = "http://localhost:4000";

export function dbPathToUrl(filePath: string): string {
  if (!filePath) return "";
  return `${API_BASE}/${filePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;
}


export function urlToDbPath(fileUrl: string): string {
  if (!fileUrl) return "";
  const relativePath = fileUrl.replace(API_BASE, "").replace(/^\/+/, "");
  return relativePath.replace(/\//g, "\\");
}
