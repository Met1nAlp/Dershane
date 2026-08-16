import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ICON_KEYS } from "@/lib/icons";
import styles from "../../admin-ui.module.css";
import { updateFooterContentAction, saveSocialLinkAction, deleteSocialLinkAction } from "./actions";

export default async function AdminFooterPage() {
  const [footer, socialLinks, navLinks] = await Promise.all([
    prisma.footerContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.navLink.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>Footer</h1>
      <p className={styles.pageDesc}>Telif/kredi metni ve sosyal medya linkleri.</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Alt Metin</h2>
        <form action={updateFooterContentAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>Telif Hakkı Metni (marka adının yanında görünür, örn. &quot;© 2026 Marka. ...&quot;)</label>
            <input className={styles.input} name="copyrightSuffix" defaultValue={footer.copyrightSuffix} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Kredi Satırı</label>
            <input className={styles.input} name="creditLine" defaultValue={footer.creditLine} required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Sosyal Medya Linkleri ({socialLinks.length})</h2>
        <div className={styles.list}>
          {socialLinks.map((s) => (
            <form key={s.id} action={saveSocialLinkAction} className={styles.listItem}>
              <input type="hidden" name="id" defaultValue={s.id} />
              <div className={styles.listItemGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Sıra</label>
                  <input className={`${styles.input} ${styles.orderField}`} type="number" name="order" defaultValue={s.order} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Platform (İkon)</label>
                  <select className={styles.select} name="platform" defaultValue={s.platform}>
                    {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>URL</label>
                  <input className={styles.input} name="url" defaultValue={s.url} required />
                </div>
              </div>
              <div className={styles.itemActions}>
                <button type="submit" formAction={deleteSocialLinkAction} className={styles.deleteBtn}>Sil</button>
                <button type="submit" className={styles.saveBtn}>Kaydet</button>
              </div>
            </form>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <form action={saveSocialLinkAction} className={`${styles.card} ${styles.form}`}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Sıra</label>
                <input className={styles.input} type="number" name="order" defaultValue={socialLinks.length} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Platform (İkon)</label>
                <select className={styles.select} name="platform" defaultValue={ICON_KEYS[0]}>
                  {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>URL</label>
              <input className={styles.input} name="url" placeholder="https://instagram.com/..." required />
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn}>Ekle</button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Menü Linkleri</h2>
        <p className={styles.hint}>
          Footer&apos;daki menü linkleri Navbar ile aynı listeyi kullanır —{" "}
          <Link href="/admin/navbar" style={{ color: "var(--accent)" }}>Navbar sayfasından</Link> yönetilir.
        </p>
        <ul style={{ marginTop: 8, paddingLeft: 20, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          {navLinks.map((l) => (
            <li key={l.id}>{l.label} — {l.href}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
