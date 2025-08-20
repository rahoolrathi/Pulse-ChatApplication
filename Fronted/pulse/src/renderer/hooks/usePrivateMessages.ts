import { useAuth } from "./useAuth";
import { chatService } from "../services/chatService";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
export const usePrivateMessages = (
  otherUserId: string | null,
  page: number = 1
) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.privateMessages(otherUserId || ""), page],
    queryFn: () => chatService.getPrivateMessages(token!, otherUserId!, page),
    enabled: !!token && !!otherUserId,
    staleTime: 30 * 1000,
  });
};
