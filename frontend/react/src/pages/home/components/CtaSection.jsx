import { Link } from "react-router-dom";

function CtaSection() {
  return (
    <section className="cta-section">
      <div>
        <span>Ready to build your AI workflow?</span>
        <h2>Start using ChatFlow AI for everyday conversations.</h2>
      </div>

      <Link to="/register" className="primary-button">
        Create free account
      </Link>
    </section>
  );
}

export default CtaSection;