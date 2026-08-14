"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FaCircleCheck } from "react-icons/fa6";
import type { AboutContent, AboutPillar } from "@prisma/client";
import { getIcon } from "@/lib/icons";
import styles from "./About.module.css";

interface AboutProps {
  about: AboutContent;
  pillars: AboutPillar[];
}

export default function About({ about, pillars }: AboutProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className={`section ${styles.section}`} id="hakkimizda" ref={ref}>
      <div className="container">
        <div className={styles.layout}>

          <motion.div
            className={styles.textSide}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge">{about.badge}</span>
            <h2 className={styles.title}>
              {about.titleLine1}
              <br />
              <span className="gradient-text">{about.titleAccent}</span>
            </h2>
            <p className={styles.desc}>
              {about.description}
            </p>

            <div className={styles.mainCard}>
              <div className={styles.mainCardInner}>
                <div className={styles.yearBadge}>{about.foundingYear}</div>
                <div className={styles.yearLabel}>{about.foundingLabel}</div>
                <div className={styles.yearSub}>{about.foundingSub}</div>
              </div>
            </div>
          </motion.div>

          <div className={styles.cardsSide}>
            {pillars.map((p, i) => {
              const Icon = getIcon(p.icon);
              return (
                <motion.div
                  key={p.id}
                  className={styles.stickyCard}
                  style={{ top: `${120 + i * 20}px` }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.pillarIcon}>
                      <Icon size={24} color="var(--accent)" />
                    </div>
                    <h3 className={styles.pillarTitle}>{p.title}</h3>
                  </div>
                  <p className={styles.pillarDesc}>{p.description}</p>
                  <div className={styles.highlightItem}>
                    <FaCircleCheck size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{p.highlight}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
