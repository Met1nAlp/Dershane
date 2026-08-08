"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaStar } from "react-icons/fa6";
import type { TeamMember } from "@prisma/client";
import styles from "./Team.module.css";

interface TeamProps {
  team: TeamMember[];
}

export default function Team({ team }: TeamProps) {
  const [active, setActive] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Create the curtain reveal effect by sliding in from the right
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["100vw", "0vw"]);

  return (
    <section className={styles.sectionWrapper} id="kadromuz" ref={sectionRef}>
      <motion.div style={{ x }} className={styles.sectionInner}>
        <div className="container">
          <div className="section-header">
            <span className="badge">👨‍🏫 Ekibimiz</span>
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
                onHoverStart={() => setActive(i)}
                onClick={() => setActive(i)}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div
                  className={styles.bgImage}
                  style={{ backgroundImage: `url(${t.imageUrl})` }}
                />
                <div
                  className={styles.overlay}
                  style={{ backgroundColor: active === i ? "rgba(0,0,0,0.5)" : t.colorHex }}
                />

                <div className={styles.content}>
                  {/* Vertical title for inactive state */}
                  <div className={styles.verticalTitle} style={{ opacity: active === i ? 0 : 1 }}>
                    {t.name}
                  </div>

                  {/* Full content for active state */}
                  <motion.div
                    className={styles.activeContent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: active === i ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: active === i ? 0.2 : 0 }}
                  >
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, s) => (
                        <FaStar key={s} size={14} color="#fbbf24" />
                      ))}
                    </div>
                    <h3 className={styles.name}>{t.name}</h3>
                    <div className={styles.branch}>{t.branch}</div>
                    <div className={styles.exp}>{t.experienceLabel}</div>
                    <p className={styles.detail}>{t.detail}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
