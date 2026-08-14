"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useMotionValueEvent, animate } from "framer-motion";
import type { StatItem, StatsSectionContent } from "@prisma/client";
import styles from "./Stats.module.css";

interface StatsSectionProps {
  statsSection: StatsSectionContent;
  statsItems: StatItem[];
}

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    const controls = animate(0, value, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = `${prefix}${Math.round(v).toLocaleString("tr-TR")}${suffix}`;
      }
    });

    return () => controls.stop();
  }, [value, prefix, suffix, inView]);

  return <div className={styles.statValue} ref={ref}>{prefix}0{suffix}</div>;
}

function JourneyVideo({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    video.currentTime = Math.min(Math.max(latest, 0), 1) * video.duration;
  });

  return (
    <div className={styles.journeyVisual}>
      <video
        ref={videoRef}
        className={styles.journeyVideo}
        src="/journey.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
}

export default function StatsSection({ statsSection, statsItems }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section className={styles.statsSection} id="basarilar" ref={sectionRef}>
      <JourneyVideo sectionRef={sectionRef} />

      <div className={`container ${styles.container}`}>

        <div className={styles.stickyColumn}>
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge">{statsSection.badge}</span>
            <h2 className={styles.title}>{statsSection.titleLine1}<br />{statsSection.titleLine2}</h2>
            <p className={styles.desc}>
              {statsSection.description}
            </p>
          </motion.div>
        </div>

        <div className={styles.cardsColumn}>
          {statsItems.map((s, i) => (
            <motion.div
              key={s.id}
              className={styles.statCard}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <AnimatedCounter value={s.value} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} />
              <h3 className={styles.statLabel}>{s.label}</h3>
              <p className={styles.statDesc}>{s.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
