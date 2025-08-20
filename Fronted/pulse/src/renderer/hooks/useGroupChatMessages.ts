import hooks from "./index";
export const useGroupChatMessages = (groupId: string | null) => {
  const messagesQuery = hooks.useGroupMessages(groupId);

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    refetch: messagesQuery.refetch,
  };
};
