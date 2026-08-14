"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaStar, FaChevronDown } from "react-icons/fa6";
import type { TeamMember } from "@prisma/client";
import styles from "./Team.module.css";

interface TeamProps {
  team: TeamMember[];
}

// Mobilde akordiyon (buyuyup kuculen kart) kullanilmiyor; hover olmadigi
// icin kesfedilemiyor ve 7 kisi 70px'e sikisip okunamaz hale geliyordu.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

// Ogretmenin kendi rengini kart zemininde cok silik bir ton olarak kullanir.
function tint(hex: string, alpha: number) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex?.trim() ?? "");
  if (!m) return undefined;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export default function Team({ team }: TeamProps) {
  const [active, setActive] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  // Perde efekti sagdan iceri kayarak acilir. Mobilde "center center" ile
  // bolum ancak ortaya gelince tamamlaniyordu; ust kartlar okunmadan
  // kaydirilip gidiyordu. Mobilde cok daha erken tamamlansin.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: isMobile ? ["start end", "start 0.72"] : ["start end", "center center"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["100vw", "0vw"]);

  return (
    <section className={styles.sectionWrapper} id="kadromuz" ref={sectionRef}>
      <motion.div style={{ x }} className={styles.sectionInner}>
        <div className="container">
          <div className="section-header">
            <span className="badge">Ekibimiz</span>
            <h2 className="section-title">Uzman Öğretmen Kadromuz</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginTop: "16px" }}>
              Alanlarında uzman, deneyimli ve öğrenci odaklı öğretmenlerimizle tanışın.
            </p>
          </div>

          <div className={styles.accordionContainer}>
            {team.map((t, i) => (
              <motion.div
                key={t.id}
                className={`${styles.accordionItem} ${active === i ? styles.active : ""}`}
                style={
                  isMobile
                    ? {
                        backgroundColor: tint(t.colorHex, active === i ? 0.14 : 0.08),
                        borderColor: tint(t.colorHex, active === i ? 0.45 : 0.2),
                      }
                    : undefined
                }
                onHoverStart={() => setActive(i)}
                onClick={() => setActive(i)}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div
                  className={styles.bgImage}
                  style={{
                    backgroundImage: `url(${t.imageUrl})`,
                    ...(isMobile ? { boxShadow: `0 0 0 2px ${tint(t.colorHex, 0.3)}` } : {}),
                  }}
                />
                <div
                  className={styles.overlay}
                  style={isMobile ? undefined : { backgroundColor: active === i ? "rgba(0,0,0,0.5)" : t.colorHex }}
                />

                <div className={styles.content}>
                  {/* Dikey isim yalnizca masaustu akordiyonun pasif halinde */}
                  {!isMobile && (
                    <div className={styles.verticalTitle} style={{ opacity: active === i ? 0 : 1 }}>
                      {t.name}
                    </div>
                  )}

                  {/* Mobilde her kartta temel bilgiler acik; detay dokununca acilir */}
                  <motion.div
                    className={styles.activeContent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isMobile || active === i ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: !isMobile && active === i ? 0.2 : 0 }}
                  >
                    {!isMobile && (
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, s) => (
                          <FaStar key={s} size={14} color="#fbbf24" />
                        ))}
                      </div>
                    )}
                    <h3 className={styles.name}>{t.name}</h3>
                    <div className={styles.branch}>{t.branch}</div>
                    <div className={styles.exp}>{t.experienceLabel}</div>
                    {(!isMobile || active === i) && (
                      <p className={styles.detail}>{t.detail}</p>
                    )}
                  </motion.div>
                </div>

                {/* Kartin dokunulabilir oldugunu belli eden gosterge */}
                {isMobile && (
                  <motion.span
                    className={styles.chevron}
                    animate={{ rotate: active === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    aria-hidden="true"
                  >
                    <FaChevronDown size={14} />
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
