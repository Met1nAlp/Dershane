import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Services from "@/components/Services/Services";
import Team from "@/components/Team/Team";
import StatsSection from "@/components/Stats/Stats";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <div style={{ position: "relative", zIndex: 1, background: "var(--bg)" }}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Team />
          <StatsSection />
          <Contact />
        </main>
      </div>
      <div style={{ position: "sticky", bottom: 0, zIndex: 0 }}>
        <Footer />
      </div>
    </>
  );
}
