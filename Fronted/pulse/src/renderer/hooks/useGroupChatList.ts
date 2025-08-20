import hooks from "./index";
import { chatService } from "../services/chatService";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
export const useGroupChatList = () => {
  const { token } = hooks.useAuth();

  const query = useQuery({
    queryKey: queryKeys.groupChatList,
    queryFn: () => chatService.getGroupChatList(token!),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });

  return {
    ...query,
    refetchGroupChats: query.refetch,
  };
};
