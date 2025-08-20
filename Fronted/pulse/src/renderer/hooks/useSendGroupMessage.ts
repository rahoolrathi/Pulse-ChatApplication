import hooks from ".";
export const useSendGroupMessage = () => {
  const { sendGroupMessage, isConnected } = hooks.useSocket();

  const sendMessage = (
    groupId: string,
    content: string,
    messageType?: string,
    attachmentUrl?: string
  ) => {
    if (!isConnected) {
      throw new Error("Not connected to server");
    }

    sendGroupMessage({
      content,
      groupId,
      messageType: messageType || "text",
      attachmentUrl,
    });
  };

  return {
    sendMessage,
    isConnected,
    canSend: isConnected,
  };
};
