"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import styles from "./Stats.module.css";

const stats = [
  { value: 2400, suffix: "+", label: "Üniversite Yerleşimi", desc: "Doğru yönlendirme ve azimli çalışmanın en güzel kanıtı mezunlarımızdır." },
  { value: 94, prefix: "%", label: "Başarı Oranı", desc: "Kişiselleştirilmiş deneme analizi ve birebir etüt sistemi ile emsalsiz başarı." },
  { value: 150, suffix: "+", label: "Uzman Öğretmen", desc: "Branşında lider, güçlü, dinamik bir eğitim kadrosuna sahibiz." },
  { value: 18, suffix: "", label: "Yıllık Deneyim", desc: "18 yıldır değişen sınav sistemlerine hızla adapte oluyor ve nesiller yetiştiriyoruz." }
];

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    const controls = animate(0, value, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = `${prefix}${Math.round(v).toLocaleString("tr-TR")}${suffix}`;
      }
    });

    return () => controls.stop();
  }, [value, prefix, suffix, inView]);

  return <div className={styles.statValue} ref={ref}>{prefix}0{suffix}</div>;
}

export default function StatsSection() {
  return (
    <section className={styles.statsSection} id="basarilar">
      <div className={`container ${styles.container}`}>

        <div className={styles.stickyColumn}>
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge">📈 Kanıtlanmış Sistem</span>
            <h2 className={styles.title}>Başarı<br />Hikayemiz</h2>
            <p className={styles.desc}>
              Yılların getirdiği tecrübe ve alanında uzman kadromuzla, öğrencilerimizi sadece sınavlara değil geleceğe hazırlıyoruz. Rakamlar, doğru sistemin en büyük şahididir.
            </p>
          </motion.div>
        </div>

        <div className={styles.cardsColumn}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className={styles.statCard}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              <h3 className={styles.statLabel}>{s.label}</h3>
              <p className={styles.statDesc}>{s.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
