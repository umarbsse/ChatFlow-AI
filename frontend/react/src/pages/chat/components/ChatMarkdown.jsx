import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMarkdown({ item, copiedCodeKey, onCopyCode }) {
  return (
    <div className="chat-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const codeText = String(children).replace(/\n$/, "");
            const languageMatch = /language-(\w+)/.exec(className || "");
            const language = languageMatch ? languageMatch[1] : "code";
            const codeKey = `${item.id}-${codeText.length}-${codeText.slice(
              0,
              30
            )}`;

            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <div className="chat-code-block">
                <div className="chat-code-header">
                  <span className="chat-code-language">{language}</span>

                  <button
                    type="button"
                    className="chat-code-copy-btn"
                    onClick={() => onCopyCode(codeText, codeKey)}
                  >
                    <i
                      className={`fa-solid ${
                        copiedCodeKey === codeKey ? "fa-check" : "fa-copy"
                      }`}
                    ></i>
                    <span>
                      {copiedCodeKey === codeKey ? "Copied" : "Copy code"}
                    </span>
                  </button>
                </div>

                <pre>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {item.text || ""}
      </ReactMarkdown>
    </div>
  );
}

export default ChatMarkdown;