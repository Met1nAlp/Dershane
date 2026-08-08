import { prisma } from "@/lib/prisma";
import { ICON_KEYS } from "@/lib/icons";
import styles from "../../admin-ui.module.css";
import { updateAboutAction, savePillarAction, deletePillarAction } from "./actions";

export default async function AdminAboutPage() {
  const [about, pillars] = await Promise.all([
    prisma.aboutContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.aboutPillar.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>Hakkımızda</h1>
      <p className={styles.pageDesc}>Tanıtım metni ve üç öne çıkan başlık kartı.</p>

      <div className={styles.section}>
        <form action={updateAboutAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>Rozet Metni</label>
            <input className={styles.input} name="badge" defaultValue={about.badge} required />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Başlık (1. satır)</label>
              <input className={styles.input} name="titleLine1" defaultValue={about.titleLine1} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Başlık (vurgulu kısım)</label>
              <input className={styles.input} name="titleAccent" defaultValue={about.titleAccent} required />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Açıklama</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="description" defaultValue={about.description} required />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Kuruluş Yılı</label>
              <input className={styles.input} name="foundingYear" defaultValue={about.foundingYear} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Kuruluş Etiketi</label>
              <input className={styles.input} name="foundingLabel" defaultValue={about.foundingLabel} required />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Kuruluş Alt Metni</label>
            <input className={styles.input} name="foundingSub" defaultValue={about.foundingSub} required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Öne Çıkan Başlıklar ({pillars.length})</h2>
        <div className={styles.list}>
          {pillars.map((p) => (
            <form key={p.id} action={savePillarAction} className={styles.listItem}>
              <input type="hidden" name="id" defaultValue={p.id} />
              <div className={styles.listItemGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Sıra</label>
                  <input className={`${styles.input} ${styles.orderField}`} type="number" name="order" defaultValue={p.order} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>İkon</label>
                  <select className={styles.select} name="icon" defaultValue={p.icon}>
                    {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Başlık</label>
                  <input className={styles.input} name="title" defaultValue={p.title} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Açıklama</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} name="description" defaultValue={p.description} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Vurgu Metni</label>
                  <input className={styles.input} name="highlight" defaultValue={p.highlight} required />
                </div>
              </div>
              <div className={styles.itemActions}>
                <button type="submit" formAction={deletePillarAction} className={styles.deleteBtn}>Sil</button>
                <button type="submit" className={styles.saveBtn}>Kaydet</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Yeni Başlık Ekle</h2>
        <form action={savePillarAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Sıra</label>
              <input className={styles.input} type="number" name="order" defaultValue={pillars.length} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>İkon</label>
              <select className={styles.select} name="icon" defaultValue={ICON_KEYS[0]}>
                {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Başlık</label>
            <input className={styles.input} name="title" placeholder="örn. Hedef Odaklı" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Açıklama</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="description" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Vurgu Metni</label>
            <input className={styles.input} name="highlight" required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
