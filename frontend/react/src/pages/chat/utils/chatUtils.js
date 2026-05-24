export function formatChatMessage(item) {
  return {
    id: item.id,
    sender: Number(item.chat_owner) === 1 ? "user" : "assistant",
    text: item.msg,
    msgType: Number(item.msg_type),
    fileName: item.file_name,
    filePath: item.file_path,
    fileFullPath: item.file_full_path,
    instanceTitle: item.instance_title,
  };
}

export function getFileDownloadUrl(filePath) {
  if (!filePath) return "#";

  const cleanPath = filePath.replace(/\\/g, "/").replace(/\/+/g, "/");

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  const fileBaseUrl =
    import.meta.env.VITE_FILE_BASE_URL || "http://127.0.0.1:8000";

  return `${fileBaseUrl.replace(/\/$/, "")}/${cleanPath.replace(/^\//, "")}`;
}

export function getCopyText(item) {
  if (item.msgType === 2) {
    const fileUrl = getFileDownloadUrl(item.filePath);
    return `${item.fileName || "Download file"}\n${fileUrl}`;
  }

  return item.text || "";
}

export function buildTemporaryUserMessage(userMessage, selectedFile) {
  return {
    id: `temp-${Date.now()}`,
    sender: "user",
    text: selectedFile
      ? `${userMessage || "Attachment"}\n📎 ${selectedFile.name}`
      : userMessage,
    msgType: selectedFile ? 2 : 1,
    fileName: selectedFile ? selectedFile.name : null,
    filePath: null,
    fileFullPath: null,
    isTemporary: true,
  };
}

export function extractChatInstanceTitle(responseData) {
  const fileMessage = responseData?.file_message;
  const userMessage = responseData?.user_message;
  const aiMessage = responseData?.ai_message;

  return (
    fileMessage?.instance_title ||
    userMessage?.instance_title ||
    aiMessage?.instance_title ||
    responseData?.instance_title ||
    ""
  );
}

export function extractChatInstanceId(responseData) {
  return (
    responseData?.ai_instance_id ||
    responseData?.user_message?.ai_instance_id ||
    responseData?.ai_message?.ai_instance_id ||
    responseData?.file_message?.ai_instance_id ||
    null
  );
}