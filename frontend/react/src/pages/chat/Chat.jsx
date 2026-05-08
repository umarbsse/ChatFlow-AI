import { useState } from "react";
import LeftNavbar from "../../components/LeftNavbar";
import Header from "../../components/Header";

function Chat() {
  const [message, setMessage] = useState("");

  

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hello John! How can I help you today?",
    },
    {
      id: 2,
      sender: "user",
      text: "I want to create a modern chat page like ChatGPT.",
    },
    {
      id: 3,
      sender: "assistant",
      text: "Great. I can help you build a clean chat interface with recent chat history on the left and the main conversation window on the right.",
    },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: previousMessages.length + 1,
        sender: "user",
        text: message,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="chat-app">
      <LeftNavbar />
      <main className="chat-content">
        <Header />
        <section className="chat-message-area">
          <div className="chat-welcome-box">
            <div className="chat-welcome-icon">
              <i className="fa-solid fa-comments"></i>
            </div>
            <h3 className="fw-bold mb-2">How can I help you today?</h3>
            <p className="text-muted mb-0">
              Start a conversation or continue your recent chat.
            </p>
          </div>

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
            />

            <button type="submit" className="chat-send-btn">
              <i className="fa-solid fa-paper-plane"></i>
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