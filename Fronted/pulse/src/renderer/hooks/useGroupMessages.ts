import hooks from "./index";
import { chatService } from "../services/chatService";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
export const useGroupMessages = (
  groupId: string | null,
  page: number = 1,
  limit: number = 50
) => {
  const { token } = hooks.useAuth();

  return useQuery({
    queryKey: [...queryKeys.groupMessages(groupId || ""), page],
    queryFn: () => chatService.getGroupMessages(token!, groupId!, page, limit),
    enabled: !!token && !!groupId,
    staleTime: 30 * 1000,
  });
};
