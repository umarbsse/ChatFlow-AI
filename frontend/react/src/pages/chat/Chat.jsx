import ChatFooter from "./components/ChatFooter";
import ChatInstanceTitle from "./components/ChatInstanceTitle";
import ChatLoading from "./components/ChatLoading";
import ChatThread from "./components/ChatThread";
import ChatWelcome from "./components/ChatWelcome";
import useChat from "./hooks/useChat";

function Chat() {
  const {
    chatInstanceId,
    chatTitle,
    messages,
    message,
    selectedFile,
    sending,
    loadingMessages,
    errorMessage,
    copiedMessageId,
    copiedCodeKey,
    deletingMessageId,
    chatBottomRef,
    fileInputRef,
    textareaRef,
    handleMessageChange,
    handleMessageKeyDown,
    handleAttachmentClick,
    handleFileChange,
    removeSelectedFile,
    handleCopyMessage,
    handleCopyCode,
    handleDeleteMessage,
    handleSendMessage,
  } = useChat();

  return (
    <>
      <section className="chat-message-area">
        {chatInstanceId && <ChatInstanceTitle chatTitle={chatTitle} />}

        {!chatInstanceId && messages.length === 0 && !loadingMessages && (
          <ChatWelcome />
        )}

        {loadingMessages && <ChatLoading />}

        {errorMessage && (
          <div
            className="alert alert-danger mx-auto"
            style={{ maxWidth: "850px" }}
          >
            <i className="fa-solid fa-circle-exclamation me-2"></i>
            {errorMessage}
          </div>
        )}

        <ChatThread
          messages={messages}
          sending={sending}
          chatBottomRef={chatBottomRef}
          copiedMessageId={copiedMessageId}
          copiedCodeKey={copiedCodeKey}
          deletingMessageId={deletingMessageId}
          onCopyMessage={handleCopyMessage}
          onCopyCode={handleCopyCode}
          onDeleteMessage={handleDeleteMessage}
        />
      </section>

      <ChatFooter
        message={message}
        selectedFile={selectedFile}
        sending={sending}
        fileInputRef={fileInputRef}
        textareaRef={textareaRef}
        onSubmit={handleSendMessage}
        onAttachmentClick={handleAttachmentClick}
        onFileChange={handleFileChange}
        onRemoveSelectedFile={removeSelectedFile}
        onMessageChange={handleMessageChange}
        onMessageKeyDown={handleMessageKeyDown}
      />
    </>
  );
}

export default Chat;