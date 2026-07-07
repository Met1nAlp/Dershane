"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaCalculator, FaFlask, FaGlobe, FaScroll, FaPalette, FaClipboardCheck, FaArrowTrendUp, FaBell, FaBookOpen } from "react-icons/fa6";
import styles from "./Services.module.css";

const services = [
  { icon: FaCalculator, title: "Matematik & Geometri", desc: "Temel kavramdan ileri düzey problem çözümüne kadar kapsamlı Matematik eğitimi." },
  { icon: FaGlobe, title: "Türkçe & Edebiyat", desc: "Sözel beceri, okuduğunu anlama ve yazılı anlatım güçlendirme programları." },
  { icon: FaFlask, title: "Fen Bilimleri", desc: "Fizik, Kimya ve Biyoloji derslerinde deney odaklı, kalıcı öğrenme modeli." },
  { icon: FaScroll, title: "Sosyal Bilimler", desc: "Tarih, Coğrafya ve Felsefe alanlarında soru bazlı, ezberden uzak anlatım." },
  { icon: FaPalette, title: "Yabancı Dil", desc: "YDT ve günlük hayata yönelik İngilizce dil becerileri geliştirme programı." },
  { icon: FaClipboardCheck, title: "Deneme Sınavları", desc: "Gerçek sınav formatında, her hafta düzenlenen TYT/AYT deneme sınavları ve analizi." },
  { icon: FaArrowTrendUp, title: "Bireysel Etüt", desc: "Öğrencinin zayıf olduğu konulara odaklanan, birebir planlı etüt programları." },
  { icon: FaBell, title: "Veli Bilgilendirme", desc: "Anlık devamsızlık bildirimleri, aylık veli toplantıları ve düzenli sınav raporları." },
  { icon: FaBookOpen, title: "Rehberlik", desc: "Tercih döneminden meslek seçimine kadar uzman rehberlik öğretmenleriyle destek." },
];

export default function Services() {
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
  }, []);

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
                YKS'den KPSS'ye, bireysel etütten grup derslerine kadar her ihtiyaca özel eğitim çözümleri sunuyoruz.
              </p>
            </div>
          </div>

          <motion.div ref={sliderRef} style={{ x }} className={styles.horizontalSlider}>
            <div className={styles.sliderPadding} />

            {services.map((s, i) => (
              <div key={i} className={styles.slideCard}>
                <div className={styles.iconWrap}>
                  <s.icon size={36} color="var(--accent)" />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardDesc}>{s.desc}</p>
                </div>
              </div>
            ))}

            <div className={styles.sliderPadding} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
