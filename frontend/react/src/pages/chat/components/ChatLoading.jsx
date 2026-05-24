function ChatLoading() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mt-3 mb-0">Loading chat messages...</p>
    </div>
  );
}

export default ChatLoading;