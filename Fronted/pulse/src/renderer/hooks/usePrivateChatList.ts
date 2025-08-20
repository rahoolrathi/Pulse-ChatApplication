import hooks from "./index";
import { chatService } from "../services/chatService";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
export const usePrivateChatList = () => {
  const { token } = hooks.useAuth();

  return useQuery({
    queryKey: queryKeys.privateChatList,
    queryFn: () => chatService.getPrivateChatList(token!),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
};
