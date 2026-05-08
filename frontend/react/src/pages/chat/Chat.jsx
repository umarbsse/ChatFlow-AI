import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftNavbar from "../../components/LeftNavbar";
import Header from "../../components/Header";
import api from "../../services/api";

function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();

  const chatInstanceId = id ? Number(id) : null;

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [chatListRefreshKey, setChatListRefreshKey] = useState(0);

  const chatBottomRef = useRef(null);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatInstanceId) {
        setMessages([]);
        return;
      }

      try {
        setLoadingMessages(true);
        setErrorMessage("");

        const response = await api.get(`/chat/${chatInstanceId}/messages`);

        const chatMessages =
          response.data.data?.messages ||
          response.data.messages ||
          [];

        const formattedMessages = chatMessages.map((item) => ({
          id: item.id,
          sender: Number(item.chat_owner) === 1 ? "user" : "assistant",
          text: item.msg,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        setMessages([]);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();

    if (!userMessage) return;

    setErrorMessage("");
    setSending(true);

    const temporaryUserMessage = {
      id: Date.now(),
      sender: "user",
      text: userMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      temporaryUserMessage,
    ]);

    setMessage("");

    try {
      const response = await api.post("/chat/send", {
        msg: userMessage,
        msg_type: 1,
        ai_instance_id: chatInstanceId,
      });

      const responseChatInstanceId =
        response.data.data?.ai_instance_id ||
        response.data.data?.user_message?.ai_instance_id ||
        response.data.data?.ai_message?.ai_instance_id;

      const aiReply =
        response.data.data?.ai_message?.msg ||
        response.data.data?.reply ||
        response.data.message ||
        "Message sent successfully.";

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          sender: "assistant",
          text: aiReply,
        },
      ]);

      setChatListRefreshKey((previousKey) => previousKey + 1);

      if (!chatInstanceId && responseChatInstanceId) {
        navigate(`/chat/${responseChatInstanceId}`, { replace: true });
      }
    } catch (error) {
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
          {messages.length === 0 && !loadingMessages && (
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

                  <div className="chat-message-bubble">{item.text}</div>
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
            <button type="button" className="chat-form-btn">
              <i className="fa-solid fa-paperclip"></i>
            </button>

            <input
              type="text"
              className="form-control chat-form-input"
              placeholder="Message ChatFlow AI..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending}
            />

            <button type="submit" className="chat-send-btn" disabled={sending}>
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