"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaChevronDown } from "react-icons/fa6";
import type { HeroContent, StatItem } from "@prisma/client";
import MagneticButton from "@/components/MagneticButton/MagneticButton";
import { getIcon } from "@/lib/icons";
import styles from "./Hero.module.css";

interface HeroProps {
  hero: HeroContent;
  heroStats: StatItem[];
}

function formatStatValue(s: StatItem) {
  return `${s.prefix ?? ""}${s.value.toLocaleString("tr-TR")}${s.suffix ?? ""}`;
}

export default function Hero({ hero, heroStats }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);

  const rotatingWords = hero.rotatingWords;
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingWords]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`;
        ctx.fill();
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const scrollDown = () => {
    const el = document.getElementById("hakkimizda");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.overlay} />
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={`container ${styles.content}`} style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div className="badge" style={{ marginBottom: "24px" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            {hero.badge}
          </motion.div>

          <motion.h1
            className={styles.heading}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {hero.headingLine1}
            <br />
            <span className={styles.headingAccentWrapper}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className={styles.headingAccent}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            className={styles.subtext}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {hero.subtext}
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <MagneticButton
              className="btn btn-primary"
              onClick={() => { const el = document.getElementById("iletisim"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            >
              {hero.primaryCtaLabel} <FaArrowRight size={16} />
            </MagneticButton>
            <button
              className="btn btn-secondary"
              onClick={() => { const el = document.getElementById("hizmetler"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            >
              {hero.secondaryCtaLabel}
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.statsRow}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {heroStats.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <motion.div
                key={s.id}
                className={styles.statItem}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
              >
                <div className={styles.statIcon}>
                  <Icon size={22} color="var(--accent)" />
                </div>
                <div>
                  <div className={styles.statValue}>{formatStatValue(s)}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <button className={styles.scrollCue} onClick={scrollDown} aria-label="Aşağı kaydır">
        <FaChevronDown size={18} color="rgba(27,58,92,0.55)" />
      </button>
    </section>
  );
}
