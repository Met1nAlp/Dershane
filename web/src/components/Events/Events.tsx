"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaChevronDown } from "react-icons/fa6";
import type { EventItem, EventsSectionContent } from "@prisma/client";
import styles from "./Events.module.css";

interface EventsProps {
  sectionContent: EventsSectionContent;
  events: EventItem[];
}

// Akordiyonda pasif kart flex:1, acik kart flex:4. 1152px'lik container'da
// 8 kartta acik kart ~378px kalir (aciklama rahat sigar); 10'da ~310px'e
// duserek sikisir. Bu yuzden satir basina sinir 8.
const MAX_PER_ROW = 8;

function splitRows(items: EventItem[]): EventItem[][] {
  const rows: EventItem[][] = [];
  for (let i = 0; i < items.length; i += MAX_PER_ROW) {
    rows.push(items.slice(i, i + MAX_PER_ROW));
  }

  // Son satirda tek kart kalirsa tum genisligi kaplayip bozuk duruyor;
  // bir onceki satirdan bir kart asagi alinir (9 -> 8+1 yerine 7+2).
  if (rows.length > 1) {
    const last = rows[rows.length - 1];
    const prev = rows[rows.length - 2];
    if (last.length === 1 && prev.length > 1) {
      const moved = prev.pop();
      if (moved) last.unshift(moved);
    }
  }

  return rows;
}

// Mobilde akordiyon (buyuyup kuculen kart) kullanilmiyor; hover olmadigi
// icin kesfedilemiyor ve kartlar okunamaz seritlere sikisiyordu.
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

export default function Events({ sectionContent, events }: EventsProps) {
  // Her satir kendi acik kartini tutar; oge sayisi degisince state bozulmasin
  // diye dizi yerine sozluk kullaniliyor (okurken `?? 0`).
  const [activeByRow, setActiveByRow] = useState<Record<number, number>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const rows = splitRows(events);

  // Perde efekti sagdan iceri kayarak acilir. Mobilde "center center" ile
  // bolum ancak ortaya gelince tamamlaniyordu; ust kartlar okunmadan
  // kaydirilip gidiyordu. Mobilde cok daha erken tamamlansin.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: isMobile ? ["start end", "start 0.72"] : ["start end", "center center"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["100vw", "0vw"]);

  return (
    <section className={styles.sectionWrapper} id="etkinlikler" ref={sectionRef}>
      <motion.div style={{ x }} className={styles.sectionInner}>
        <div className="container">
          <div className="section-header">
            <span className="badge">{sectionContent.badge}</span>
            <h2 className="section-title">{sectionContent.title}</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginTop: "16px" }}>
              {sectionContent.description}
            </p>
          </div>

          <div className={styles.accordionContainer}>
            {rows.map((row, r) => (
              <div
                key={r}
                className={`${styles.accordionRow} ${rows.length > 1 ? styles.compact : ""}`}
              >
                {row.map((e, i) => {
                  const isActive = (activeByRow[r] ?? 0) === i;

                  // Kartlar bilerek motion.div degil: CSS `transition: flex`
                  // zaten akordiyonu animasyonluyor. Ustune Framer'in `layout`
                  // prop'u eklenince ikisi ayni ozelligi cekistirip her hover'da
                  // tum alt agaci yeniden olcturuyor ve sayfa takiliyordu.
                  return (
                    <div
                      key={e.id}
                      className={`${styles.accordionItem} ${isActive ? styles.active : ""}`}
                      onMouseEnter={() => setActiveByRow((p) => ({ ...p, [r]: i }))}
                      onClick={() => setActiveByRow((p) => ({ ...p, [r]: i }))}
                    >
                      <div
                        className={styles.bgImage}
                        style={{ backgroundImage: `url(${e.imageUrl})` }}
                      />
                      {/* Iki ayri katman, opacity ile gecis yapiyor: blend mode
                          yerine compositor dostu bir capraz gecis. */}
                      <div className={styles.overlay} />
                      <div className={styles.overlayActive} />

                      <div className={styles.content}>
                        {/* Mobilde her kartta temel bilgiler acik; aciklama dokununca acilir */}
                        <div className={styles.activeContent}>
                          <span className={styles.tag}>{e.tag}</span>
                          <h3 className={styles.title}>{e.title}</h3>
                          {e.description && (!isMobile || isActive) && (
                            <p className={styles.description}>{e.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Kartin dokunulabilir oldugunu belli eden gosterge */}
                      {isMobile && (
                        <span className={styles.chevron} aria-hidden="true">
                          <FaChevronDown size={14} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
