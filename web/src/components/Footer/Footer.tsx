import { FaGraduationCap, FaInstagram, FaXTwitter, FaYoutube, FaFacebookF } from "react-icons/fa6";
import styles from "./Footer.module.css";

const links = [
  { label: "Hakkımızda", href: "#hakkimizda" },
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Kadromuz", href: "#kadromuz" },
  { label: "Başarılar", href: "#basarilar" },
  { label: "İletişim", href: "#iletisim" },
];

const socials = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaXTwitter, href: "#", label: "Twitter" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
  { icon: FaFacebookF, href: "#", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>
              <FaGraduationCap size={20} color="#fff" />
            </div>
            <div>
              <div className={styles.logoText}>Kayaalp Dershane</div>
              <div className={styles.logoSub}>Başarıya Giden Yol</div>
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
            {socials.map((s) => (
              <a key={s.label} href={s.href} className={styles.socialBtn} aria-label={s.label}>
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Kayaalp Dershane. Tüm hakları saklıdır.</span>
          <span>Sevgiyle yapıldı 🎓</span>
        </div>
      </div>
    </footer>
  );
}
