import ChatFileMessage from "./ChatFileMessage";
import ChatMarkdown from "./ChatMarkdown";

function ChatMessage({
  item,
  copiedMessageId,
  copiedCodeKey,
  deletingMessageId,
  onCopyMessage,
  onCopyCode,
  onDeleteMessage,
}) {
  const isUser = item.sender === "user";

  return (
    <div className={`chat-message ${isUser ? "chat-message-user" : ""}`}>
      <div className="chat-message-avatar">
        {isUser ? (
          <i className="fa-solid fa-user"></i>
        ) : (
          <i className="fa-solid fa-robot"></i>
        )}
      </div>

      <div className="chat-message-content">
        <div className="chat-message-name">
          {isUser ? "You" : "ChatFlow AI"}
        </div>

        <div className="chat-message-bubble">
          {renderMessageBody(item, copiedCodeKey, onCopyCode)}
        </div>

        {!item.isTemporary && (
          <div className="chat-message-actions">
            <button
              type="button"
              className="chat-message-action-btn"
              onClick={() => onCopyMessage(item)}
              title="Copy"
            >
              <i
                className={`fa-solid ${
                  copiedMessageId === item.id ? "fa-check" : "fa-copy"
                }`}
              ></i>
              <span>{copiedMessageId === item.id ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              className="chat-message-action-btn chat-message-action-danger"
              onClick={() => onDeleteMessage(item)}
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
  );
}

function renderMessageBody(item, copiedCodeKey, onCopyCode) {
  if (item.msgType === 2) {
    return <ChatFileMessage item={item} />;
  }

  if (item.sender === "assistant") {
    return (
      <ChatMarkdown
        item={item}
        copiedCodeKey={copiedCodeKey}
        onCopyCode={onCopyCode}
      />
    );
  }

  return <div className="chat-plain-text">{item.text}</div>;
}

export default ChatMessage;