function ChatFooter({
  message,
  selectedFile,
  sending,
  fileInputRef,
  textareaRef,
  onSubmit,
  onAttachmentClick,
  onFileChange,
  onRemoveSelectedFile,
  onMessageChange,
  onMessageKeyDown,
}) {
  return (
    <footer className="chat-footer">
      <form className="chat-form" onSubmit={onSubmit}>
        <input
          type="file" ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onFileChange}
          disabled={sending}
        />

        <button
          type="button"
          className="chat-form-btn"
          onClick={onAttachmentClick}
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
                onClick={onRemoveSelectedFile}
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
            onChange={onMessageChange}
            onKeyDown={onMessageKeyDown}
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
  );
}

export default ChatFooter;