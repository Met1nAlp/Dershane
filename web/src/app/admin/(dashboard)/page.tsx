import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "../admin-ui.module.css";

const SECTIONS = [
  { href: "/admin/hero", label: "Hero", desc: "Ana başlık, alt metin, butonlar" },
  { href: "/admin/about", label: "Hakkımızda", desc: "Tanıtım metni ve öne çıkan başlıklar" },
  { href: "/admin/services", label: "Hizmetler", desc: "Sunulan hizmet kartları" },
  { href: "/admin/team", label: "Kadromuz", desc: "Öğretmen kartları ve fotoğrafları" },
  { href: "/admin/events", label: "Etkinlikler", desc: "Etkinlik fotoğrafları ve başlıkları" },
  { href: "/admin/stats", label: "İstatistikler", desc: "Sayaçlar ve başarı bölümü metni" },
  { href: "/admin/contact", label: "İletişim", desc: "İletişim bilgileri ve gelen mesajlar" },
  { href: "/admin/settings", label: "Ayarlar", desc: "Marka, sosyal linkler, admin şifresi" },
];

export default async function AdminHomePage() {
  const unreadCount = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div>
      <h1 className={styles.pageTitle}>Admin Panel</h1>
      <p className={styles.pageDesc}>
        Web sitesinin tüm içeriğini buradan yönetebilirsiniz.
        {unreadCount > 0 && (
          <> Okunmamış <strong>{unreadCount}</strong> mesajınız var.</>
        )}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className={styles.card} style={{ display: "block" }}>
            <div style={{ fontWeight: 700, color: "var(--primary)", marginBottom: 6 }}>
              {s.label}
              {s.href === "/admin/contact" && unreadCount > 0 && (
                <span style={{ marginLeft: 8, fontSize: "0.75rem", background: "var(--accent)", color: "#fff", borderRadius: 999, padding: "2px 8px" }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
