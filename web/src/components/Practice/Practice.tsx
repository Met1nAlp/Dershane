"use client";

import { motion, Variants } from "framer-motion";
import type { PracticeItem, PracticeSectionContent } from "@prisma/client";
import styles from "./Practice.module.css";

interface PracticeProps {
  sectionContent: PracticeSectionContent;
  items: PracticeItem[];
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

export default function Practice({ sectionContent, items }: PracticeProps) {
  return (
    <section
      className="section brand-watermark"
      id="deneme"
      style={{ background: "var(--surface)", position: "relative" }}
    >
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="badge">{sectionContent.badge}</span>
          <h2 className="section-title">{sectionContent.title}</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ marginTop: "16px" }}>
            {sectionContent.description}
          </p>
        </motion.div>

        <div className={styles.grid}>
          {items.map((p, i) => (
            <motion.div
              key={p.id}
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
                  style={{ backgroundImage: `url(${p.imageUrl})` }}
                  custom={i}
                  variants={imageVariants}
                  whileHover={{ scale: 1.08, transition: { duration: 0.6, ease: "easeOut" } }}
                />
              </div>

              <div className={styles.overlay} />

              <motion.div className={styles.info} custom={i} variants={infoVariants}>
                <span className={styles.tag}>{p.tag}</span>
                <h3 className={styles.title}>{p.title}</h3>
                {p.description && <p className={styles.description}>{p.description}</p>}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
