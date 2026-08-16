"use client";

import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FaGraduationCap } from "react-icons/fa6";
import type { NavLink } from "@prisma/client";
import styles from "./Navbar.module.css";

interface NavbarProps {
  brandName: string;
  navLinks: NavLink[];
  ctaLabel: string;
}

export default function Navbar({ brandName, navLinks, ctaLabel }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("");
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

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is HTMLElement => !!el);

    if (!sections.length) return;

    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = sections[0];
      for (const el of sections) {
        if (el.offsetTop <= probe) {
          current = el;
        }
      }
      setActiveHref(`#${current.id}`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navLinks]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    // Etkinlikler masaustunde viewport'a yakin yukseklikte, ustten hizalamak
    // altta bosluk birakiyordu; bunun yerine altini hizala. Mobilde bolum
    // dikey bir liste olarak coook daha uzun oldugu icin bu tersine doner
    // (baslik ve ilk kartlar tamamen gizlenir) — sadece masaustunde uygula.
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const block = href === "#etkinlikler" && !isMobile ? "end" : "start";
    el.scrollIntoView({ behavior: "smooth", block });
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
              key={link.id}
              className={`${styles.navLink} ${activeHref === link.href ? styles.navLinkActive : ""}`}
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className={styles.cta}>
          <button className="btn btn-primary" onClick={() => handleNavClick("#iletisim")}>
            {ctaLabel}
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
              key={link.id}
              className={`${styles.mobileNavLink} ${activeHref === link.href ? styles.mobileNavLinkActive : ""}`}
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </button>
          ))}
          <button
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={() => handleNavClick("#iletisim")}
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </header>
  );
}
