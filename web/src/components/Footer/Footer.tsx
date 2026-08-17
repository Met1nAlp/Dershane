import Image from "next/image";
import type { SiteSettings, SocialLink, NavLink } from "@prisma/client";
import { getIcon } from "@/lib/icons";
import styles from "./Footer.module.css";

interface FooterProps {
  siteSettings: SiteSettings;
  socialLinks: SocialLink[];
  navLinks: NavLink[];
  copyrightSuffix: string;
  creditLine: string;
}

export default function Footer({ siteSettings, socialLinks, navLinks, copyrightSuffix, creditLine }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Image
              className={styles.logoIcon}
              src="/logo.png"
              alt={siteSettings.brandName}
              width={48}
              height={48}
            />
            <div>
              <div className={styles.logoText}>{siteSettings.brandName}</div>
              <div className={styles.logoSub}>{siteSettings.brandTagline}</div>
            </div>
          </div>

          <nav className={styles.links}>
            {navLinks.map((l) => (
              <a key={l.id} href={l.href} className={styles.footerLink}>
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
          <span>© {new Date().getFullYear()} {siteSettings.brandName}. {copyrightSuffix}</span>
          <span>{creditLine}</span>
        </div>
      </div>
    </footer>
  );
}
