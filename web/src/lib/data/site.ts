import { cache } from "react";
import { prisma } from "@/lib/prisma";

// React'in cache() yardımcı fonksiyonu, aynı istek (request) içinde birden
// fazla yerden çağrılsa bile (örn. hem layout hem page.tsx) sorguyu bir kez
// çalıştırır. Bu, Supabase pooler bağlantı limitini gereksiz yere zorlamamak
// için önemli.
export const getSiteSettings = cache(async () => {
  return prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });
});

export async function getHomePageData() {
  const [
    hero,
    stats,
    statsSection,
    about,
    aboutPillars,
    servicesSection,
    services,
    practiceSection,
    practice,
    eventsSection,
    events,
    contactSection,
    contact,
    siteSettings,
    socialLinks,
    navbar,
    footer,
    navLinks,
  ] = await Promise.all([
    prisma.heroContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.statItem.findMany({ orderBy: { order: "asc" } }),
    prisma.statsSectionContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.aboutContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.aboutPillar.findMany({ orderBy: { order: "asc" } }),
    prisma.servicesSectionContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.serviceItem.findMany({ orderBy: { order: "asc" } }),
    prisma.practiceSectionContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.practiceItem.findMany({ orderBy: { order: "asc" } }),
    prisma.eventsSectionContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.eventItem.findMany({ orderBy: { order: "asc" } }),
    prisma.contactSectionContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.contactInfo.findUniqueOrThrow({ where: { id: 1 } }),
    getSiteSettings(),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.navbarContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.footerContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.navLink.findMany({ orderBy: { order: "asc" } }),
  ]);

  return {
    hero,
    heroStats: stats.filter((s) => s.showInHero),
    statsSection,
    statsItems: stats.filter((s) => s.showInStats),
    about,
    aboutPillars,
    servicesSection,
    services,
    practiceSection,
    practice,
    eventsSection,
    events,
    contactSection,
    contact,
    siteSettings,
    socialLinks,
    navbar,
    footer,
    navLinks,
  };
}

export type HomePageData = Awaited<ReturnType<typeof getHomePageData>>;
