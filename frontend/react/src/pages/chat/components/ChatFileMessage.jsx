import { getFileDownloadUrl } from "../utils/chatUtils";

function ChatFileMessage({ item }) {
  return (
    <a
      href={getFileDownloadUrl(item.filePath)}
      target="_blank"
      rel="noopener noreferrer"
      className="chat-file-link"
      download
    >
      <span className="chat-file-icon">
        <i className="fa-solid fa-file"></i>
      </span>

      <span className="chat-file-info">
        <span className="chat-file-name">
          {item.fileName || "Download file"}
        </span>
        <span className="chat-file-action">Click to download</span>
      </span>

      <span className="chat-file-download-icon">
        <i className="fa-solid fa-download"></i>
      </span>
    </a>
  );
}

export default ChatFileMessage;