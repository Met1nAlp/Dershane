import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "../admin-ui.module.css";

const SECTIONS = [
  { href: "/admin/navbar", label: "Navbar", desc: "Menü linkleri ve \"Kayıt Ol\" butonu" },
  { href: "/admin/hero", label: "Hero", desc: "Ana başlık, alt metin, butonlar" },
  { href: "/admin/about", label: "Hakkımızda", desc: "Tanıtım metni ve öne çıkan başlıklar" },
  { href: "/admin/services", label: "Hizmetler", desc: "Bölüm başlığı ve hizmet kartları" },
  { href: "/admin/deneme", label: "Deneme ve Soru Çözümü", desc: "Bölüm başlığı ve kart içerikleri" },
  { href: "/admin/events", label: "Etkinlikler", desc: "Bölüm başlığı, etkinlik fotoğrafları ve başlıkları" },
  { href: "/admin/basarilar", label: "Başarılar", desc: "Sayaçlar ve bölüm metni" },
  { href: "/admin/contact", label: "İletişim", desc: "Bölüm ve form metinleri, iletişim bilgileri, gelen mesajlar" },
  { href: "/admin/footer", label: "Footer", desc: "Telif/kredi metni ve sosyal medya linkleri" },
  { href: "/admin/settings", label: "Ayarlar", desc: "Marka adı/slogan, admin şifresi" },
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
