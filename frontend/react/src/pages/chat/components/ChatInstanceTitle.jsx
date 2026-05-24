function ChatInstanceTitle({ chatTitle }) {
  return (
    <div className="chat-instance-title-box">
      <div className="chat-welcome-icon">
        <i className="fa-solid fa-comments"></i>
      </div>

      <h3 className="fw-bold mb-2">{chatTitle || "Untitled Chat"}</h3>

      <p className="text-muted mb-0">
        Continue your conversation with ChatFlow AI.
      </p>
    </div>
  );
}

export default ChatInstanceTitle;