import { FaGraduationCap } from "react-icons/fa6";
import type { SiteSettings, SocialLink } from "@prisma/client";
import { getIcon } from "@/lib/icons";
import styles from "./Footer.module.css";

interface FooterProps {
  siteSettings: SiteSettings;
  socialLinks: SocialLink[];
}

const links = [
  { label: "Hakkımızda", href: "#hakkimizda" },
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Kadromuz", href: "#kadromuz" },
  { label: "Başarılar", href: "#basarilar" },
  { label: "İletişim", href: "#iletisim" },
];

export default function Footer({ siteSettings, socialLinks }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>
              <FaGraduationCap size={20} color="#fff" />
            </div>
            <div>
              <div className={styles.logoText}>{siteSettings.brandName}</div>
              <div className={styles.logoSub}>{siteSettings.brandTagline}</div>
            </div>
          </div>

          <nav className={styles.links}>
            {links.map((l) => (
              <a key={l.href} href={l.href} className={styles.footerLink}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className={styles.socials}>
            {socialLinks.map((s) => {
              const Icon = getIcon(s.platform);
              return (
                <a key={s.id} href={s.url} className={styles.socialBtn} aria-label={s.platform}>
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} {siteSettings.brandName}. Tüm hakları saklıdır.</span>
          <span>Dershane öğrencisi tarafından sevgiyle yapıldı - Metin KAYAALP</span>
        </div>
      </div>
    </footer>
  );
}
