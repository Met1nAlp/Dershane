import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Services from "@/components/Services/Services";
import Practice from "@/components/Practice/Practice";
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
        <Navbar brandName={data.siteSettings.brandName} navLinks={data.navLinks} ctaLabel={data.navbar.ctaLabel} />
        <main>
          <Hero hero={data.hero} heroStats={data.heroStats} />
          <About about={data.about} pillars={data.aboutPillars} />
          <Services sectionContent={data.servicesSection} services={data.services} />
          <Practice sectionContent={data.practiceSection} items={data.practice} />
          <Events sectionContent={data.eventsSection} events={data.events} />
          <StatsSection statsSection={data.statsSection} statsItems={data.statsItems} />
          <Contact sectionContent={data.contactSection} contact={data.contact} />
        </main>
      </div>
      <div style={{ position: "sticky", bottom: 0, zIndex: 0 }}>
        <Footer
          siteSettings={data.siteSettings}
          socialLinks={data.socialLinks}
          navLinks={data.navLinks}
          copyrightSuffix={data.footer.copyrightSuffix}
          creditLine={data.footer.creditLine}
        />
      </div>
    </>
  );
}
