import "../../assets/css/home.css";

const quickTasks = [
  "Write emails",
  "Summarize notes",
  "Plan your day",
  "Brainstorm ideas",
  "Ask questions",
  "Get instant help",
];

const features = [
  {
    title: "Daily AI conversations",
    description:
      "ChatFlow AI helps users handle everyday conversations, questions, writing, planning, and productivity tasks in one clean chat experience.",
  },
  {
    title: "Powered by OpenAI",
    description:
      "Built to connect with OpenAI APIs, so users can get intelligent, natural, and helpful responses for day-to-day work.",
  },
  {
    title: "Simple and focused",
    description:
      "No clutter. Just a beautiful interface where users can start chatting, think clearly, and get things done faster.",
  },
];

const Home = () => {
  return (
    <main className="home-page">
      <section className="hero-section">
        <nav className="home-nav">
          <div className="brand">
            <div className="brand-icon">CF</div>
            <span>ChatFlow AI</span>
          </div>

          <div className="nav-actions">
            <a href="/login" className="nav-link">
              Sign in
            </a>
            <a href="/register" className="nav-button">
              Get Started
            </a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="pulse-dot"></span>
              AI chat app for everyday productivity
            </div>

            <h1>Your daily AI companion for smarter conversations.</h1>

            <p className="hero-description">
              ChatFlow AI is a modern web app built for daily chat with OpenAI.
              Users can ask questions, write content, summarize ideas, plan
              tasks, and get instant help for everyday work.
            </p>

            <div className="hero-actions">
              <a href="/register" className="primary-button">
                Start chatting now
              </a>
              <a href="/login" className="secondary-button">
                I already have an account
              </a>
            </div>

            <div className="trust-row">
              <div>
                <strong>Fast</strong>
                <span>Real-time replies</span>
              </div>

              <div>
                <strong>Clean</strong>
                <span>Modern chat UI</span>
              </div>

              <div>
                <strong>Useful</strong>
                <span>For daily tasks</span>
              </div>
            </div>
          </div>

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
                  Absolutely. I can organize your tasks, prioritize your
                  schedule, and draft a polished email in seconds.
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
        </div>
      </section>

      <section className="tasks-section">
        <div className="section-heading">
          <span>What users can do</span>
          <h2>Built for daily tasks, not complicated workflows.</h2>
        </div>

        <div className="task-pills">
          {quickTasks.map((task) => (
            <div className="task-pill" key={task}>
              {task}
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        {features.map((feature, index) => (
          <article className="feature-card" key={feature.title}>
            <div className="feature-number">0{index + 1}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <div>
          <span>Ready to build your AI workflow?</span>
          <h2>Start using ChatFlow AI for everyday conversations.</h2>
        </div>

        <a href="/register" className="primary-button">
          Create free account
        </a>
      </section>
    </main>
  );
};

export default Home;