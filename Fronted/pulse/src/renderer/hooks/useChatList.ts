import hooks from "./index";
export const useChatList = () => {
  const chatQuery = hooks.usePrivateChatList();

  return {
    chats: chatQuery.data || [],
    isLoading: chatQuery.isLoading,
    error: chatQuery.error,
    refetch: chatQuery.refetch,
  };
};
