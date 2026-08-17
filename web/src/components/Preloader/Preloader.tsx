"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  brandName: string;
}

export default function Preloader({ brandName }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  // Navbar ile ayni kural: ilk kelime marka, sonraki iki kelime turuncu alt satir.
  // toUpperCase() Ingilizce kuralini uygulayip "Treni" -> "TRENI" yapiyor;
  // Turkce'de "i" -> "I" degil "İ" olmali.
  const words = brandName.split(" ");
  const firstWord = words[0].toLocaleUpperCase("tr-TR");
  const restOfBrand = words.slice(1, 3).join(" ").toLocaleUpperCase("tr-TR");

  useEffect(() => {
    // Alt satir 0.4s gecikmeyle 0.6s'de tamamlaniyor; 1000ms'de kapaninca
    // son satir gorunmeden kayboluyordu.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#C4D0E0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <motion.div
            exit={{ scale: 1.06, opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ lineHeight: 0 }}
            >
              <Image
                src="/logo.png"
                alt={brandName}
                width={132}
                height={132}
                priority
                style={{
                  width: "clamp(88px, 26vw, 132px)",
                  height: "auto",
                  borderRadius: "50%",
                  boxShadow: "0 10px 30px rgba(27,58,92,0.28)",
                }}
              />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 18, letterSpacing: "0.02em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.08em" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                color: "var(--primary)",
                fontSize: "clamp(2.6rem, 12vw, 5rem)",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {firstWord}
            </motion.span>

            {restOfBrand && (
              <>
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "72px", opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
                  style={{
                    height: "3px",
                    borderRadius: "99px",
                    background: "var(--accent)",
                  }}
                />
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    color: "var(--accent)",
                    fontSize: "clamp(1rem, 4.2vw, 1.7rem)",
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    // letter-spacing sagda bosluk birakir, optik ortalama icin
                    textIndent: "0.3em",
                  }}
                >
                  {restOfBrand}
                </motion.span>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
