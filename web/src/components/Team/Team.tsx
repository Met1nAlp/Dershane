"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaStar } from "react-icons/fa6";
import styles from "./Team.module.css";

const teachers = [
  { name: "Ahmet Yılmaz", branch: "Matematik & Geometri", exp: "14 yıl deneyim", detail: "YKS 2024'te 8 öğrencisi ilk 500'e girdi.", initials: "AY", color: "#3b82f6", image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Fatma Kaya", branch: "Türkçe & Edebiyat", exp: "11 yıl deneyim", detail: "Sözel alan uzmanı.", initials: "FK", color: "#8b5cf6", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Murat Demir", branch: "Fizik & Kimya", exp: "9 yıl deneyim", detail: "Deney odaklı öğretim.", initials: "MD", color: "#10b981", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Zeynep Arslan", branch: "Biyoloji", exp: "7 yıl deneyim", detail: "TYT Fen dereceleri uzmanı.", initials: "ZA", color: "#f59e0b", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Can Çelik", branch: "Tarih & Coğrafya", exp: "10 yıl deneyim", detail: "Sosyal bilimler şampiyonu.", initials: "CC", color: "#ef4444", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Selin Öztürk", branch: "İngilizce & YDT", exp: "8 yıl deneyim", detail: "YDT 100 tam puan koçu.", initials: "SÖ", color: "#06b6d4", image: "https://images.unsplash.com/photo-1598550874175-4d0ef43ce902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

export default function Team() {
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
            {teachers.map((t, i) => (
              <motion.div
                key={i}
                className={`${styles.accordionItem} ${active === i ? styles.active : ""}`}
                onHoverStart={() => setActive(i)}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div 
                  className={styles.bgImage} 
                  style={{ backgroundImage: `url(${t.image})` }} 
                />
                <div 
                  className={styles.overlay} 
                  style={{ backgroundColor: active === i ? "rgba(0,0,0,0.5)" : t.color }} 
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
                    <div className={styles.exp}>{t.exp}</div>
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
