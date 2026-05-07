import { useState } from "react";

function Chat() {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState("");

  const chats = [
    { id: 1, title: "React Laravel Chat App", time: "Today" },
    { id: 2, title: "User authentication setup", time: "Yesterday" },
    { id: 3, title: "Bootstrap UI design", time: "2 days ago" },
    { id: 4, title: "Laravel API structure", time: "Last week" },
  ];

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
      <aside className="chat-sidebar">
        <div className="chat-sidebar-top">
          <button className="btn btn-light w-100 fw-semibold rounded-3">
            <i className="fa-solid fa-plus me-2"></i>
            New Chat
          </button>

          <div className="input-group mt-3">
            <span className="input-group-text bg-transparent text-light border-secondary">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              className="form-control bg-transparent text-light border-secondary"
              placeholder="Search chats"
            />
          </div>
        </div>

        <div className="chat-sidebar-body">
          <div className="chat-section-title">Recent Chats</div>

          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className={`chat-list-item ${
                activeChat === chat.id ? "active" : ""
              }`}
              onClick={() => setActiveChat(chat.id)}
            >
              <span className="chat-list-icon">
                <i className="fa-regular fa-message"></i>
              </span>

              <span className="chat-list-content">
                <span className="chat-list-title">{chat.title}</span>
                <span className="chat-list-time">{chat.time}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="chat-sidebar-bottom">
          <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-between rounded-3">
            <span className="d-flex align-items-center">
              <span className="chat-user-avatar me-2">J</span>
              <span>John</span>
            </span>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
      </aside>

      <main className="chat-content">
        <header className="chat-header">
          <div>
            <h5 className="mb-0 fw-bold">ChatFlow AI</h5>
            <small className="text-muted">Ask anything about your project</small>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm rounded-pill">
              <i className="fa-solid fa-share-nodes me-1"></i>
              Share
            </button>

            <button className="btn btn-outline-secondary btn-sm rounded-circle">
              <i className="fa-solid fa-gear"></i>
            </button>
          </div>
        </header>

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