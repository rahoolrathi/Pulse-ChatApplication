import hooks from ".";
export const useGroupChats = () => {
  const groupQuery = hooks.useGroupChatList();

  return {
    groups: groupQuery.data || [],
    isLoading: groupQuery.isLoading,
    error: groupQuery.error,
    refetch: groupQuery.refetch,
    refetchGroupChats: groupQuery.refetchGroupChats,
  };
};
