"use client";

import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa6";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Hakkımızda", href: "#hakkimizda" },
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Kadromuz", href: "#kadromuz" },
  { label: "Etkinlikler", href: "#etkinlikler" },
  { label: "Başarılar", href: "#basarilar" },
  { label: "İletişim", href: "#iletisim" },
];

interface NavbarProps {
  brandName: string;
}

export default function Navbar({ brandName }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Navbar'da yer kısıtlı olduğu için markanın yalnızca ilk üç kelimesi
  // gösterilir (tam resmi ad footer ve sayfa başlığında kullanılıyor).
  const words = brandName.split(" ");
  const [firstWord, ...restWords] = words.slice(0, 3);
  const restOfBrand = restWords.join(" ");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${menuOpen ? styles.menuOpen : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#" className={styles.logo} title={brandName} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className={styles.logoIcon}>
            <FaGraduationCap size={20} color="#fff" />
          </div>
          <span className={styles.logoText}>
            {firstWord} {restOfBrand && <span className={styles.logoAccent}>{restOfBrand}</span>}
          </span>
        </a>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <button
              key={link.href}
              className={styles.navLink}
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className={styles.cta}>
          <button className="btn btn-primary" onClick={() => handleNavClick("#iletisim")}>
            Kayıt Ol
          </button>
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          {menuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <button
              key={link.href}
              className={styles.mobileNavLink}
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </button>
          ))}
          <button
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={() => handleNavClick("#iletisim")}
          >
            Kayıt Ol
          </button>
        </div>
      )}
    </header>
  );
}
