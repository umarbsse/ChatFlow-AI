import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import {
  buildTemporaryUserMessage,
  extractChatInstanceId,
  extractChatInstanceTitle,
  formatChatMessage,
  getCopyText,
} from "../utils/chatUtils";

function useChat() {
  const navigate = useNavigate();
  const { id } = useParams();

  const chatInstanceId = id ? Number(id) : null;

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [copiedCodeKey, setCopiedCodeKey] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [chatTitle, setChatTitle] = useState("");
  const [messages, setMessages] = useState([]);

  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatInstanceId) {
        setMessages([]);
        setChatTitle("");
        return;
      }

      try {
        setLoadingMessages(true);
        setErrorMessage("");

        const response = await api.get(`/chat/${chatInstanceId}/messages`);

        const chatMessages =
          response.data.data?.messages || response.data.messages || [];

        const instanceTitle =
          response.data.data?.instance_title ||
          chatMessages.find((item) => item.instance_title)?.instance_title ||
          "";

        setChatTitle(instanceTitle);
        setMessages(chatMessages.map(formatChatMessage));
      } catch (error) {
        setMessages([]);
        setChatTitle("");
        setErrorMessage(
          error.response?.data?.message || "Failed to load chat messages."
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchChatMessages();
  }, [chatInstanceId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, sending, loadingMessages]);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  };

  const resetTextareaHeight = () => {
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }, 0);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);

    setTimeout(() => {
      resizeTextarea();
    }, 0);
  };

  const handleMessageKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!sending && (message.trim() || selectedFile)) {
        handleSendMessage(event);
      }
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyMessage = async (item) => {
    try {
      const textToCopy = getCopyText(item);

      if (!textToCopy) return;

      await navigator.clipboard.writeText(textToCopy);

      setCopiedMessageId(item.id);

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 1500);
    } catch (error) {
      setErrorMessage("Failed to copy message.");
    }
  };

  const handleCopyCode = async (codeText, codeKey) => {
    try {
      if (!codeText) return;

      await navigator.clipboard.writeText(codeText);

      setCopiedCodeKey(codeKey);

      setTimeout(() => {
        setCopiedCodeKey(null);
      }, 1500);
    } catch (error) {
      setErrorMessage("Failed to copy code.");
    }
  };

  const handleDeleteMessage = async (item) => {
    if (!item?.id || deletingMessageId) return;

    const confirmed = window.confirm("Delete this message?");

    if (!confirmed) return;

    try {
      setDeletingMessageId(item.id);
      setErrorMessage("");

      await api.delete(`/chat/messages/${item.id}`);

      setMessages((previousMessages) =>
        previousMessages.filter((messageItem) => messageItem.id !== item.id)
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to delete message."
      );
    } finally {
      setDeletingMessageId(null);
    }
  };

  const appendResponseMessages = (responseData) => {
    const fileMessage = responseData?.file_message;
    const userMessageResponse = responseData?.user_message;
    const aiMessageResponse = responseData?.ai_message;

    const newMessages = [];

    if (fileMessage) {
      newMessages.push(formatChatMessage(fileMessage));
    }

    if (userMessageResponse) {
      newMessages.push(formatChatMessage(userMessageResponse));
    }

    if (aiMessageResponse) {
      newMessages.push(formatChatMessage(aiMessageResponse));
    }

    if (newMessages.length === 0) {
      const aiReply =
        responseData?.reply || "Message sent successfully.";

      newMessages.push({
        id: Date.now() + 1,
        sender: "assistant",
        text: aiReply,
        msgType: 1,
        fileName: null,
        filePath: null,
        fileFullPath: null,
      });
    }

    setMessages((previousMessages) => [...previousMessages, ...newMessages]);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const userMessage = message.trim();

    if (!userMessage && !selectedFile) return;

    setErrorMessage("");
    setSending(true);

    const temporaryUserMessage = buildTemporaryUserMessage(
      userMessage,
      selectedFile
    );

    setMessages((previousMessages) => [
      ...previousMessages,
      temporaryUserMessage,
    ]);

    setMessage("");
    resetTextareaHeight();

    try {
      const formData = new FormData();

      formData.append("msg", userMessage);
      formData.append("msg_type", selectedFile ? 2 : 1);

      if (chatInstanceId) {
        formData.append("ai_instance_id", chatInstanceId);
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await api.post("/chat/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = response.data.data || {};
      const responseChatInstanceId = extractChatInstanceId(responseData);
      const responseInstanceTitle = extractChatInstanceTitle(responseData);

      if (responseInstanceTitle) {
        setChatTitle(responseInstanceTitle);
      }

      setMessages((previousMessages) =>
        previousMessages.filter((item) => item.id !== temporaryUserMessage.id)
      );

      appendResponseMessages(responseData);

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (!chatInstanceId && responseChatInstanceId) {
        navigate(`/chat/${responseChatInstanceId}`, { replace: true });
      }
    } catch (error) {
      setMessages((previousMessages) =>
        previousMessages.filter((item) => item.id !== temporaryUserMessage.id)
      );

      setErrorMessage(
        error.response?.data?.message || "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  return {
    chatInstanceId,
    chatTitle,
    messages,
    message,
    selectedFile,
    sending,
    loadingMessages,
    errorMessage,
    copiedMessageId,
    copiedCodeKey,
    deletingMessageId,
    chatBottomRef,
    fileInputRef,
    textareaRef,
    handleMessageChange,
    handleMessageKeyDown,
    handleAttachmentClick,
    handleFileChange,
    removeSelectedFile,
    handleCopyMessage,
    handleCopyCode,
    handleDeleteMessage,
    handleSendMessage,
  };
}

export default useChat;