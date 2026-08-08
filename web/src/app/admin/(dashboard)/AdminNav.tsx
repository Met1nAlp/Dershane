"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { href: "/admin", label: "Ana Sayfa" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/about", label: "Hakkımızda" },
  { href: "/admin/services", label: "Hizmetler" },
  { href: "/admin/team", label: "Kadromuz" },
  { href: "/admin/events", label: "Etkinlikler" },
  { href: "/admin/stats", label: "İstatistikler" },
  { href: "/admin/contact", label: "İletişim" },
  { href: "/admin/settings", label: "Ayarlar" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
