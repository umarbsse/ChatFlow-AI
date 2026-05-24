import ChatMessage from "./ChatMessage";

function ChatThread({
  messages,
  sending,
  chatBottomRef,
  copiedMessageId,
  copiedCodeKey,
  deletingMessageId,
  onCopyMessage,
  onCopyCode,
  onDeleteMessage,
}) {
  return (
    <div className="chat-thread">
      {messages.map((item) => (
        <ChatMessage
          key={item.id}
          item={item}
          copiedMessageId={copiedMessageId}
          copiedCodeKey={copiedCodeKey}
          deletingMessageId={deletingMessageId}
          onCopyMessage={onCopyMessage}
          onCopyCode={onCopyCode}
          onDeleteMessage={onDeleteMessage}
        />
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
  );
}

export default ChatThread;