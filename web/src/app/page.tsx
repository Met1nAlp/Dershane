import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Services from "@/components/Services/Services";
import Team from "@/components/Team/Team";
import Events from "@/components/Events/Events";
import StatsSection from "@/components/Stats/Stats";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import { getHomePageData } from "@/lib/data/site";

export default async function Home() {
  const data = await getHomePageData();

  return (
    <>
      <div style={{ position: "relative", zIndex: 1, background: "var(--bg)" }}>
        <Navbar brandName={data.siteSettings.brandName} />
        <main>
          <Hero hero={data.hero} heroStats={data.heroStats} />
          <About about={data.about} pillars={data.aboutPillars} />
          <Services services={data.services} />
          <Team team={data.team} />
          <Events events={data.events} />
          <StatsSection statsSection={data.statsSection} statsItems={data.statsItems} />
          <Contact contact={data.contact} />
        </main>
      </div>
      <div style={{ position: "sticky", bottom: 0, zIndex: 0 }}>
        <Footer siteSettings={data.siteSettings} socialLinks={data.socialLinks} />
      </div>
    </>
  );
}
