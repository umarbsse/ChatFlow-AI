import "../../assets/css/home.css";

import CtaSection from "./components/CtaSection";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import HomeNavbar from "./components/HomeNavbar";
import TasksSection from "./components/TasksSection";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <HomeNavbar />
        <HeroSection />
      </section>

      <TasksSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  );
}

export default Home;