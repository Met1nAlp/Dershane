"use client";

import { motion, Variants } from "framer-motion";
import type { EventItem } from "@prisma/client";
import styles from "./Events.module.css";

interface EventsProps {
  events: EventItem[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const imageVariants: Variants = {
  hidden: (i: number) => ({
    x: i % 2 === 0 ? "-110%" : "110%",
    scale: 1.15,
  }),
  visible: (i: number) => ({
    x: "0%",
    scale: 1,
    transition: { duration: 0.9, delay: i * 0.08 + 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const infoVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 + 0.55 },
  }),
};

export default function Events({ events }: EventsProps) {
  return (
    <section className="section" id="etkinlikler" style={{ background: "var(--bg)" }}>
      <div className="container">
        <div className="section-header">
          <span className="badge">🎉 Sosyal Hayat</span>
          <h2 className="section-title">Sınıfın Ötesinde Anılar</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ marginTop: "16px" }}>
            Piknikten futbol turnuvasına, bilim şenliğinden mezuniyet gecesine kadar
            öğrencilerimizle birlikte yaşadığımız anlardan kareler.
          </p>
        </div>

        <div className={styles.grid}>
          {events.map((e, i) => {
            return (
              <motion.div
                key={e.id}
                className={styles.card}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={cardVariants}
              >
                <div className={styles.imageMask}>
                  <motion.div
                    className={styles.imageInner}
                    style={{ backgroundImage: `url(${e.imageUrl})` }}
                    custom={i}
                    variants={imageVariants}
                    whileHover={{ scale: 1.08, transition: { duration: 0.6, ease: "easeOut" } }}
                  />
                </div>

                <div className={styles.overlay} />

                <motion.div className={styles.info} custom={i} variants={infoVariants}>
                  <span className={styles.tag}>{e.tag}</span>
                  <h3 className={styles.title}>{e.title}</h3>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
