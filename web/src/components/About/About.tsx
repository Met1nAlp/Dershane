"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FaCircleCheck, FaBullseye, FaHeart, FaLightbulb } from "react-icons/fa6";
import styles from "./About.module.css";

const pillars = [
  { icon: FaBullseye, title: "Hedef Odaklı", desc: "Her öğrencinin hedefi belirlenir ve tüm plan buna göre kişiselleştirilir.", highlight: "2006'dan bu yana 5.000'den fazla mezun" },
  { icon: FaHeart, title: "Öğrenci Merkezli", desc: "Ders saatinin ötesinde, psikolojik destek ve motivasyon takibi yapılır.", highlight: "Her öğrenciye özel haftalık çalışma planı" },
  { icon: FaLightbulb, title: "Yenilikçi Yöntem", desc: "Soru bazlı ve kavram haritası destekli modern eğitim teknikleri.", highlight: "Haftalık TYT/AYT denemesi ve detaylı analiz" },
];

export default function About() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="section" id="hakkimizda" style={{ background: "var(--surface)", position: "relative" }} ref={ref}>
      <div className="container">
        <div className={styles.layout}>
          
          <motion.div
            className={styles.textSide}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge">✨ Biz Kimiz</span>
            <h2 className={styles.title}>
              Başarının Arkasında
              <br />
              <span className="gradient-text">18 Yıllık Deneyim</span>
            </h2>
            <p className={styles.desc}>
              Kayaalp Dershane, 2006 yılında tek bir inançla kapılarını açtı:
              Her öğrencinin potansiyeli vardır ve doğru yönlendirmeyle çiçeklenir.
              Bugün, binlerce mezunumuzla bu inancı doğruladık.
            </p>
            
            <div className={styles.mainCard}>
              <div className={styles.mainCardInner}>
                <div className={styles.yearBadge}>2006</div>
                <div className={styles.yearLabel}>Kuruluş Yılı</div>
                <div className={styles.yearSub}>18 yıllık güven ve başarı</div>
              </div>
            </div>
          </motion.div>

          <div className={styles.cardsSide}>
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                className={styles.stickyCard}
                style={{ top: `${120 + i * 20}px` }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.pillarIcon}>
                    <p.icon size={24} color="var(--accent)" />
                  </div>
                  <h3 className={styles.pillarTitle}>{p.title}</h3>
                </div>
                <p className={styles.pillarDesc}>{p.desc}</p>
                <div className={styles.highlightItem}>
                  <FaCircleCheck size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{p.highlight}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
