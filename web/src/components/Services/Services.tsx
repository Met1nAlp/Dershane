"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ServiceItem } from "@prisma/client";
import { getIcon } from "@/lib/icons";
import styles from "./Services.module.css";

interface ServicesProps {
  services: ServiceItem[];
}

export default function Services({ services }: ServicesProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [xRange, setXRange] = useState([0, 0]);

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

  return (
    <section id="hizmetler" style={{ background: "var(--bg)" }}>
      <div ref={targetRef} className={styles.scrollWrapper}>
        <div className={styles.stickyContainer}>
          <div className={`container ${styles.headerContainer}`}>
            <div className="section-header" style={{ marginBottom: 0, textAlign: "left", alignItems: "flex-start" }}>
              <span className="badge">🎯 Ne Sunuyoruz</span>
              <h2 className="section-title">Hizmetlerimiz</h2>
              <div className="divider" style={{ marginLeft: 0 }} />
              <p className="section-subtitle" style={{ marginTop: "16px", maxWidth: "500px", marginInline: 0 }}>
                LGS&apos;den TYT/AYT&apos;ye, bireysel etütten grup derslerine kadar her ihtiyaca özel eğitim çözümleri sunuyoruz.
              </p>
            </div>
          </div>

          <motion.div ref={sliderRef} style={{ x }} className={styles.horizontalSlider}>
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
