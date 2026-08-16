import { prisma } from "@/lib/prisma";
import styles from "../../admin-ui.module.css";
import { updateNavbarContentAction, saveNavLinkAction, deleteNavLinkAction } from "./actions";

export default async function AdminNavbarPage() {
  const [navbar, navLinks] = await Promise.all([
    prisma.navbarContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.navLink.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>Navbar</h1>
      <p className={styles.pageDesc}>
        Üst menü linkleri ve &quot;Kayıt Ol&quot; buton metni. Buradaki menü linkleri Footer&apos;daki
        link listesiyle aynıdır — burada değiştirdiğinde ikisi birden güncellenir.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Buton Metni</h2>
        <form action={updateNavbarContentAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>&quot;Kayıt Ol&quot; Buton Metni</label>
            <input className={styles.input} name="ctaLabel" defaultValue={navbar.ctaLabel} required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Menü Linkleri ({navLinks.length})</h2>
        <div className={styles.list}>
          {navLinks.map((l) => (
            <form key={l.id} action={saveNavLinkAction} className={styles.listItem}>
              <input type="hidden" name="id" defaultValue={l.id} />
              <div className={styles.listItemGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Sıra</label>
                  <input className={`${styles.input} ${styles.orderField}`} type="number" name="order" defaultValue={l.order} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Etiket</label>
                  <input className={styles.input} name="label" defaultValue={l.label} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Bağlantı (örn. #hakkimizda)</label>
                  <input className={styles.input} name="href" defaultValue={l.href} required />
                </div>
              </div>
              <div className={styles.itemActions}>
                <button type="submit" formAction={deleteNavLinkAction} className={styles.deleteBtn}>Sil</button>
                <button type="submit" className={styles.saveBtn}>Kaydet</button>
              </div>
            </form>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <form action={saveNavLinkAction} className={`${styles.card} ${styles.form}`}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Sıra</label>
                <input className={styles.input} type="number" name="order" defaultValue={navLinks.length} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Etiket</label>
                <input className={styles.input} name="label" placeholder="örn. Sertifikalar" required />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Bağlantı</label>
              <input className={styles.input} name="href" placeholder="#anchor-id" required />
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn}>Ekle</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
