import { Link } from "react-router-dom";
import { trustItems } from "../homeConstants";
import HeroPreview from "./HeroPreview";

function HeroSection() {
  return (
    <div className="hero-grid">
      <div className="hero-content">
        <div className="eyebrow">
          <span className="pulse-dot"></span>
          AI chat app for everyday productivity
        </div>

        <h1>Your daily AI companion for smarter conversations.</h1>

        <p className="hero-description">
          ChatFlow AI is a modern web app built for daily chat with OpenAI.
          Users can ask questions, write content, summarize ideas, plan tasks,
          and get instant help for everyday work.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="primary-button">
            Start chatting now
          </Link>

          <Link to="/login" className="secondary-button">
            I already have an account
          </Link>
        </div>

        <div className="trust-row">
          {trustItems.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          ))}
        </div>
      </div>

      <HeroPreview />
    </div>
  );
}

export default HeroSection;