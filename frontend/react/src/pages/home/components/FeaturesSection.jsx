import { features } from "../homeConstants";

function FeaturesSection() {
  return (
    <section className="features-section">
      {features.map((feature, index) => (
        <article className="feature-card" key={feature.title}>
          <div className="feature-number">0{index + 1}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </article>
      ))}
    </section>
  );
}

export default FeaturesSection;