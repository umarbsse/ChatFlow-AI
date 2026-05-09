import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LeftNavbar from "../../components/LeftNavbar";
import Header from "../../components/Header";
import api from "../../services/api";

function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();

  const chatInstanceId = id ? Number(id) : null;

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [chatListRefreshKey, setChatListRefreshKey] = useState(0);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [copiedCodeKey, setCopiedCodeKey] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [chatTitle, setChatTitle] = useState("");

  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const [messages, setMessages] = useState([]);

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

        const formattedMessages = chatMessages.map((item) => ({
          id: item.id,
          sender: Number(item.chat_owner) === 1 ? "user" : "assistant",
          text: item.msg,
          msgType: Number(item.msg_type),
          fileName: item.file_name,
          filePath: item.file_path,
          fileFullPath: item.file_full_path,
          instanceTitle: item.instance_title,
        }));

        setMessages(formattedMessages);
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

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

    setTimeout(() => {
      resizeTextarea();
    }, 0);
  };

  const handleMessageKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!sending && (message.trim() || selectedFile)) {
        handleSendMessage(e);
      }
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileDownloadUrl = (filePath) => {
    if (!filePath) return "#";

    const cleanPath = filePath.replace(/\\/g, "/").replace(/\/+/g, "/");

    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      return cleanPath;
    }

    const fileBaseUrl =
      import.meta.env.VITE_FILE_BASE_URL || "http://127.0.0.1:8000";

    return `${fileBaseUrl.replace(/\/$/, "")}/${cleanPath.replace(/^\//, "")}`;
  };

  const getCopyText = (item) => {
    if (item.msgType === 2) {
      const fileUrl = getFileDownloadUrl(item.filePath);
      return `${item.fileName || "Download file"}\n${fileUrl}`;
    }

    return item.text || "";
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

      setChatListRefreshKey((previousKey) => previousKey + 1);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to delete message."
      );
    } finally {
      setDeletingMessageId(null);
    }
  };

  const renderMessageText = (item) => {
    if (item.msgType === 2) {
      return (
        <a
          href={getFileDownloadUrl(item.filePath)}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-file-link"
          download
        >
          <span className="chat-file-icon">
            <i className="fa-solid fa-file"></i>
          </span>

          <span className="chat-file-info">
            <span className="chat-file-name">
              {item.fileName || "Download file"}
            </span>
            <span className="chat-file-action">Click to download</span>
          </span>

          <span className="chat-file-download-icon">
            <i className="fa-solid fa-download"></i>
          </span>
        </a>
      );
    }

    if (item.sender === "assistant") {
      return (
        <div className="chat-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const codeText = String(children).replace(/\n$/, "");
                const languageMatch = /language-(\w+)/.exec(className || "");
                const language = languageMatch ? languageMatch[1] : "code";
                const codeKey = `${item.id}-${codeText.length}-${codeText.slice(
                  0,
                  30
                )}`;

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="chat-code-block">
                    <div className="chat-code-header">
                      <span className="chat-code-language">{language}</span>

                      <button
                        type="button"
                        className="chat-code-copy-btn"
                        onClick={() => handleCopyCode(codeText, codeKey)}
                      >
                        <i
                          className={`fa-solid ${
                            copiedCodeKey === codeKey ? "fa-check" : "fa-copy"
                          }`}
                        ></i>
                        <span>
                          {copiedCodeKey === codeKey ? "Copied" : "Copy code"}
                        </span>
                      </button>
                    </div>

                    <pre>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {item.text || ""}
          </ReactMarkdown>
        </div>
      );
    }

    return <div className="chat-plain-text">{item.text}</div>;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();

    if (!userMessage && !selectedFile) return;

    setErrorMessage("");
    setSending(true);

    const temporaryUserMessage = {
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

      const responseChatInstanceId =
        response.data.data?.ai_instance_id ||
        response.data.data?.user_message?.ai_instance_id ||
        response.data.data?.ai_message?.ai_instance_id;

      const fileMessage = response.data.data?.file_message;
      const userMessageResponse = response.data.data?.user_message;
      const aiMessageResponse = response.data.data?.ai_message;

      const responseInstanceTitle =
        fileMessage?.instance_title ||
        userMessageResponse?.instance_title ||
        aiMessageResponse?.instance_title ||
        response.data.data?.instance_title ||
        "";

      if (responseInstanceTitle) {
        setChatTitle(responseInstanceTitle);
      }

      setMessages((previousMessages) =>
        previousMessages.filter((item) => item.id !== temporaryUserMessage.id)
      );

      if (fileMessage) {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: fileMessage.id,
            sender: Number(fileMessage.chat_owner) === 1 ? "user" : "assistant",
            text: fileMessage.msg,
            msgType: Number(fileMessage.msg_type),
            fileName: fileMessage.file_name,
            filePath: fileMessage.file_path,
            fileFullPath: fileMessage.file_full_path,
            instanceTitle: fileMessage.instance_title,
          },
        ]);
      }

      if (userMessageResponse) {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: userMessageResponse.id,
            sender:
              Number(userMessageResponse.chat_owner) === 1
                ? "user"
                : "assistant",
            text: userMessageResponse.msg,
            msgType: Number(userMessageResponse.msg_type),
            fileName: userMessageResponse.file_name,
            filePath: userMessageResponse.file_path,
            fileFullPath: userMessageResponse.file_full_path,
            instanceTitle: userMessageResponse.instance_title,
          },
        ]);
      }

      if (aiMessageResponse) {
        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: aiMessageResponse.id,
            sender:
              Number(aiMessageResponse.chat_owner) === 1
                ? "user"
                : "assistant",
            text: aiMessageResponse.msg,
            msgType: Number(aiMessageResponse.msg_type),
            fileName: aiMessageResponse.file_name,
            filePath: aiMessageResponse.file_path,
            fileFullPath: aiMessageResponse.file_full_path,
            instanceTitle: aiMessageResponse.instance_title,
          },
        ]);
      }

      if (!fileMessage && !userMessageResponse && !aiMessageResponse) {
        const aiReply =
          response.data.data?.reply ||
          response.data.message ||
          "Message sent successfully.";

        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: Date.now() + 1,
            sender: "assistant",
            text: aiReply,
            msgType: 1,
            fileName: null,
            filePath: null,
            fileFullPath: null,
          },
        ]);
      }

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setChatListRefreshKey((previousKey) => previousKey + 1);

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

  return (
    <div className="chat-app">
      <LeftNavbar refreshKey={chatListRefreshKey} />

      <main className="chat-content">
        <Header />

        <section className="chat-message-area">
          {chatInstanceId && (
            <div className="chat-instance-title-box">
              <div className="chat-welcome-icon">
                <i className="fa-solid fa-comments"></i>
              </div>

              <h3 className="fw-bold mb-2">
                {chatTitle || "Untitled Chat"}
              </h3>

              <p className="text-muted mb-0">
                Continue your conversation with ChatFlow AI.
              </p>
            </div>
          )}

          {!chatInstanceId && messages.length === 0 && !loadingMessages && (
            <div className="chat-welcome-box">
              <div className="chat-welcome-icon">
                <i className="fa-solid fa-comments"></i>
              </div>

              <h3 className="fw-bold mb-2">How can I help you today?</h3>

              <p className="text-muted mb-0">
                Start a conversation or continue your recent chat.
              </p>
            </div>
          )}

          {loadingMessages && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3 mb-0">Loading chat messages...</p>
            </div>
          )}

          {errorMessage && (
            <div
              className="alert alert-danger mx-auto"
              style={{ maxWidth: "850px" }}
            >
              <i className="fa-solid fa-circle-exclamation me-2"></i>
              {errorMessage}
            </div>
          )}

          <div className="chat-thread">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`chat-message ${
                  item.sender === "user" ? "chat-message-user" : ""
                }`}
              >
                <div className="chat-message-avatar">
                  {item.sender === "user" ? (
                    <i className="fa-solid fa-user"></i>
                  ) : (
                    <i className="fa-solid fa-robot"></i>
                  )}
                </div>

                <div className="chat-message-content">
                  <div className="chat-message-name">
                    {item.sender === "user" ? "You" : "ChatFlow AI"}
                  </div>

                  <div className="chat-message-bubble">
                    {renderMessageText(item)}
                  </div>

                  {!item.isTemporary && (
                    <div className="chat-message-actions">
                      <button
                        type="button"
                        className="chat-message-action-btn"
                        onClick={() => handleCopyMessage(item)}
                        title="Copy"
                      >
                        <i
                          className={`fa-solid ${
                            copiedMessageId === item.id
                              ? "fa-check"
                              : "fa-copy"
                          }`}
                        ></i>
                        <span>
                          {copiedMessageId === item.id ? "Copied" : "Copy"}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="chat-message-action-btn chat-message-action-danger"
                        onClick={() => handleDeleteMessage(item)}
                        disabled={deletingMessageId === item.id}
                        title="Delete"
                      >
                        {deletingMessageId === item.id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <i className="fa-solid fa-trash"></i>
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="chat-message">
                <div className="chat-message-avatar">
                  <i className="fa-solid fa-robot"></i>
                </div>

                <div className="chat-message-content">
                  <div className="chat-message-name">ChatFlow AI</div>
                  <div className="chat-message-bubble">
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Thinking...
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef}></div>
          </div>
        </section>

        <footer className="chat-footer">
          <form className="chat-form" onSubmit={handleSendMessage}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={sending}
            />

            <button
              type="button"
              className="chat-form-btn"
              onClick={handleAttachmentClick}
              disabled={sending}
            >
              <i className="fa-solid fa-paperclip"></i>
            </button>

            <div className="flex-grow-1">
              {selectedFile && (
                <div className="mb-2 small text-muted d-flex align-items-center gap-2">
                  <span>
                    <i className="fa-solid fa-paperclip me-1"></i>
                    {selectedFile.name}
                  </span>

                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={removeSelectedFile}
                    disabled={sending}
                  >
                    Remove
                  </button>
                </div>
              )}

              <textarea
                ref={textareaRef}
                className="form-control chat-form-input chat-form-textarea"
                placeholder="Message ChatFlow AI..."
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleMessageKeyDown}
                disabled={sending}
                rows={1}
              ></textarea>
            </div>

            <button
              type="submit"
              className="chat-send-btn"
              disabled={sending || (!message.trim() && !selectedFile)}
            >
              {sending ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <i className="fa-solid fa-paper-plane"></i>
              )}
            </button>
          </form>

          <small className="chat-footer-note">
            ChatFlow AI can make mistakes. Check important information.
          </small>
        </footer>
      </main>
    </div>
  );
}

export default Chat;