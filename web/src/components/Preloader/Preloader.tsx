"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1000ms delay for a smooth initial logo reveal
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
            backgroundColor: "#030712", // dark slate color
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, letterSpacing: "4px" }}
          >
            KAYAALP<span style={{ color: "var(--primary)" }}>.</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
