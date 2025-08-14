// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  privateChatList: ["privateChatList"] as const,
  privateMessages: (userId: string) => ["privateMessages", userId] as const,
  userSearch: (query: string) => ["userSearch", query] as const,
  groupList: ["groupList"] as const,
  groupMessages: (groupId: string) => ["groupMessages", groupId] as const,
} as const;
