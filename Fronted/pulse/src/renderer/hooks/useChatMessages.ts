import hooks from "./index";
export const useChatMessages = (otherUserId: string | null) => {
  const messagesQuery = hooks.usePrivateMessages(otherUserId);

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    refetch: messagesQuery.refetch,
  };
};
