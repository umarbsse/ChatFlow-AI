function ChatWelcome() {
  return (
    <div className="chat-welcome-box">
      <div className="chat-welcome-icon">
        <i className="fa-solid fa-comments"></i>
      </div>

      <h3 className="fw-bold mb-2">How can I help you today?</h3>

      <p className="text-muted mb-0">
        Start a conversation or continue your recent chat.
      </p>
    </div>
  );
}

export default ChatWelcome;