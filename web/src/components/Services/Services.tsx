"use client";

import { useRef, useEffect, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FaBook, FaPen, FaQuoteLeft,
  FaFlask, FaAtom, FaMicroscope,
  FaEarthAmericas, FaLandmark, FaScroll,
  FaClipboardList, FaChartLine,
  FaUserGraduate,
  FaBell, FaPhone, FaHeart,
  FaCompass, FaSignsPost, FaCommentDots,
  FaGraduationCap,
} from "react-icons/fa6";
import type { ServiceItem, ServicesSectionContent } from "@prisma/client";
import { getIcon } from "@/lib/icons";
import styles from "./Services.module.css";

interface ServicesProps {
  sectionContent: ServicesSectionContent;
  services: ServiceItem[];
}

type Category = "math" | "language" | "science" | "social" | "exam" | "tutor" | "family" | "guidance" | "default";

function detectCategory(title: string): Category {
  const t = title.toLowerCase();
  if (t.includes("matematik") || t.includes("geometri")) return "math";
  if (t.includes("türkçe") || t.includes("edebiyat")) return "language";
  if (t.includes("fen") || t.includes("fizik") || t.includes("kimya") || t.includes("biyoloji")) return "science";
  if (t.includes("sosyal") || t.includes("tarih") || t.includes("coğrafya") || t.includes("felsefe")) return "social";
  if (t.includes("deneme") || t.includes("sınav")) return "exam";
  if (t.includes("etüt") || t.includes("bireysel")) return "tutor";
  if (t.includes("veli")) return "family";
  if (t.includes("rehber")) return "guidance";
  return "default";
}

type Slot = { glyph: string } | { Icon: IconType };

const ICON_SETS: Record<Category, Slot[]> = {
  math: [
    { glyph: "π" }, { glyph: "∑" }, { glyph: "√" },
    { glyph: "×" }, { glyph: "÷" }, { glyph: "+" },
    { glyph: "−" }, { glyph: "=" }, { glyph: "∫" },
  ],
  language: [
    { Icon: FaBook }, { Icon: FaPen }, { Icon: FaQuoteLeft },
    { Icon: FaBook }, { Icon: FaPen }, { Icon: FaQuoteLeft },
    { Icon: FaBook }, { Icon: FaPen }, { Icon: FaQuoteLeft },
  ],
  science: [
    { Icon: FaFlask }, { Icon: FaAtom }, { Icon: FaMicroscope },
    { Icon: FaFlask }, { Icon: FaAtom }, { Icon: FaMicroscope },
    { Icon: FaFlask }, { Icon: FaAtom }, { Icon: FaMicroscope },
  ],
  social: [
    { Icon: FaEarthAmericas }, { Icon: FaLandmark }, { Icon: FaScroll },
    { Icon: FaEarthAmericas }, { Icon: FaLandmark }, { Icon: FaScroll },
    { Icon: FaEarthAmericas }, { Icon: FaLandmark }, { Icon: FaScroll },
  ],
  exam: [
    { Icon: FaClipboardList }, { Icon: FaChartLine }, { Icon: FaBook },
    { Icon: FaClipboardList }, { Icon: FaChartLine }, { Icon: FaBook },
    { Icon: FaClipboardList }, { Icon: FaChartLine }, { Icon: FaBook },
  ],
  tutor: [
    { Icon: FaUserGraduate }, { Icon: FaBook }, { Icon: FaPen },
    { Icon: FaUserGraduate }, { Icon: FaBook }, { Icon: FaPen },
    { Icon: FaUserGraduate }, { Icon: FaBook }, { Icon: FaPen },
  ],
  family: [
    { Icon: FaBell }, { Icon: FaPhone }, { Icon: FaHeart },
    { Icon: FaBell }, { Icon: FaPhone }, { Icon: FaHeart },
    { Icon: FaBell }, { Icon: FaPhone }, { Icon: FaHeart },
  ],
  guidance: [
    { Icon: FaCompass }, { Icon: FaSignsPost }, { Icon: FaCommentDots },
    { Icon: FaCompass }, { Icon: FaSignsPost }, { Icon: FaCommentDots },
    { Icon: FaCompass }, { Icon: FaSignsPost }, { Icon: FaCommentDots },
  ],
  default: [
    { Icon: FaGraduationCap }, { Icon: FaBook }, { Icon: FaPen },
    { Icon: FaGraduationCap }, { Icon: FaBook }, { Icon: FaPen },
    { Icon: FaGraduationCap }, { Icon: FaBook }, { Icon: FaPen },
  ],
};

const POSITIONS = [
  { top: "10%", left: "54%", size: 52, rotate: -8 },
  { top: "16%", left: "86%", size: 38, rotate: 10 },
  { top: "38%", left: "8%", size: 44, rotate: 6 },
  { top: "42%", left: "93%", size: 48, rotate: -12 },
  { top: "60%", left: "24%", size: 58, rotate: 8 },
  { top: "66%", left: "72%", size: 40, rotate: -6 },
  { top: "82%", left: "46%", size: 46, rotate: 12 },
  { top: "86%", left: "12%", size: 34, rotate: -10 },
  { top: "26%", left: "68%", size: 32, rotate: 5 },
];

function SubjectBackdrop({ category }: { category: Category }) {
  const slots = ICON_SETS[category];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category}
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {slots.map((slot, i) => {
          const pos = POSITIONS[i];
          const content = "glyph" in slot
            ? <span style={{ fontSize: pos.size, fontWeight: 800, lineHeight: 1 }}>{slot.glyph}</span>
            : <slot.Icon size={pos.size} />;
          return (
            <span
              key={i}
              className={styles.backdropItem}
              style={{
                top: pos.top,
                left: pos.left,
                animationDelay: `${i * 0.35}s`,
                ["--r" as string]: `${pos.rotate}deg`,
              } as CSSProperties}
            >
              {content}
            </span>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Services({ sectionContent, services }: ServicesProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [xRange, setXRange] = useState([0, 0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mobilde scroll-jack yerine parmakla dogal yatay kaydirma kullaniliyor:
  // kullanicinin ilk refleksi yana kaydirmak ve dikey scroll'a baglamak
  // bekledigi gibi davranmiyordu.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        const scrollW = sliderRef.current.scrollWidth;
        const viewW = window.innerWidth;
        // The maximum we can scroll left is the difference between the total width and the viewport width
        setXRange([0, -(scrollW - viewW)]);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [services]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], xRange);
  const progressIndex = useTransform(scrollYProgress, [0, 1], [0, Math.max(services.length - 1, 0)]);

  useMotionValueEvent(progressIndex, "change", (latest) => {
    const idx = Math.min(Math.max(Math.round(latest), 0), Math.max(services.length - 1, 0));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const activeCategory = services.length ? detectCategory(services[activeIndex].title) : "default";

  return (
    <section id="hizmetler" style={{ background: "var(--bg)" }}>
      <div ref={targetRef} className={styles.scrollWrapper}>
        <div className={`${styles.stickyContainer} brand-watermark`}>
          <SubjectBackdrop category={activeCategory} />

          <div className={`container ${styles.headerContainer}`}>
            <motion.div
              className="section-header"
              style={{ marginBottom: 0, textAlign: "left", alignItems: "flex-start" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="badge">{sectionContent.badge}</span>
              <h2 className="section-title">{sectionContent.title}</h2>
              <div className="divider" style={{ marginLeft: 0 }} />
              <p className="section-subtitle" style={{ marginTop: "16px", maxWidth: "500px", marginInline: 0 }}>
                {sectionContent.description}
              </p>
            </motion.div>
          </div>

          <motion.div ref={sliderRef} style={{ x: isMobile ? 0 : x }} className={styles.horizontalSlider}>
            <div className={styles.sliderPadding} />

            {services.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <div key={s.id} className={styles.slideCard}>
                  <div className={styles.iconWrap}>
                    <Icon size={36} color="var(--accent)" />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{s.title}</h3>
                    <p className={styles.cardDesc}>{s.description}</p>
                  </div>
                </div>
              );
            })}

            <div className={styles.sliderPadding} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
