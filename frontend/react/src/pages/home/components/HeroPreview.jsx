function HeroPreview() {
  return (
    <div className="hero-preview" aria-label="ChatFlow AI chat preview">
      <div className="preview-glow"></div>

      <div className="chat-card">
        <div className="chat-card-header">
          <div className="window-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <span className="status-pill">OpenAI connected</span>
        </div>

        <div className="chat-messages">
          <div className="message user-message">
            Help me plan my day and write a quick email.
          </div>

          <div className="message ai-message">
            Absolutely. I can organize your tasks, prioritize your schedule, and
            draft a polished email in seconds.
          </div>

          <div className="message user-message small">
            Also summarize my meeting notes.
          </div>

          <div className="typing-row">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="chat-input-preview">
          <span>Ask ChatFlow anything...</span>
          <button type="button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default HeroPreview;