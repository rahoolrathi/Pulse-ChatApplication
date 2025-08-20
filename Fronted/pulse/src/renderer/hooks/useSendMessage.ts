import hooks from ".";
export const useSendMessage = () => {
  const { sendPrivateMessage, isConnected } = hooks.useSocket();

  const sendMessage = (
    otherUserId: string,
    content: string,
    messageType?: string
  ) => {
    if (!isConnected) {
      throw new Error("Not connected to server");
    }

    sendPrivateMessage({
      content,
      otherId: otherUserId,
      messageType: messageType || "text",
    });
  };

  return {
    sendMessage,
    isConnected,
    canSend: isConnected,
  };
};
