import { prisma } from "@/lib/prisma";
import { ICON_KEYS } from "@/lib/icons";
import styles from "../../admin-ui.module.css";
import { updateStatsSectionAction, saveStatItemAction, deleteStatItemAction } from "./actions";

export default async function AdminStatsPage() {
  const [statsSection, items] = await Promise.all([
    prisma.statsSectionContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.statItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>İstatistikler</h1>
      <p className={styles.pageDesc}>
        Buradaki sayaçlar hem Hero bölümündeki 3 kutuda hem de aşağıdaki İstatistikler bölümünde
        kullanılır — hangisinde görüneceğini "Hero'da göster" / "İstatistiklerde göster" kutularıyla seçin.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Bölüm Başlığı</h2>
        <form action={updateStatsSectionAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>Rozet Metni</label>
            <input className={styles.input} name="badge" defaultValue={statsSection.badge} required />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Başlık (1. satır)</label>
              <input className={styles.input} name="titleLine1" defaultValue={statsSection.titleLine1} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Başlık (2. satır)</label>
              <input className={styles.input} name="titleLine2" defaultValue={statsSection.titleLine2} required />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Açıklama</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="description" defaultValue={statsSection.description} required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Sayaçlar ({items.length})</h2>
        <div className={styles.list}>
          {items.map((s) => (
            <form key={s.id} action={saveStatItemAction} className={styles.listItem}>
              <input type="hidden" name="id" defaultValue={s.id} />
              <div className={styles.listItemGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Sıra</label>
                  <input className={`${styles.input} ${styles.orderField}`} type="number" name="order" defaultValue={s.order} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>İkon</label>
                  <select className={styles.select} name="icon" defaultValue={s.icon}>
                    {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className={styles.row} style={{ gridColumn: "1 / -1" }}>
                  <div className={styles.field}>
                    <label className={styles.label}>Önek (örn. %)</label>
                    <input className={styles.input} name="prefix" defaultValue={s.prefix ?? ""} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Değer</label>
                    <input className={styles.input} type="number" name="value" defaultValue={s.value} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Sonek (örn. +)</label>
                    <input className={styles.input} name="suffix" defaultValue={s.suffix ?? ""} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Etiket</label>
                  <input className={styles.input} name="label" defaultValue={s.label} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Açıklama (sadece İstatistikler bölümünde görünür)</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} name="description" defaultValue={s.description ?? ""} />
                </div>
                <div className={styles.field} style={{ flexDirection: "row", gap: 20 }}>
                  <label className={styles.checkboxRow}>
                    <input type="checkbox" name="showInHero" defaultChecked={s.showInHero} /> Hero&apos;da göster
                  </label>
                  <label className={styles.checkboxRow}>
                    <input type="checkbox" name="showInStats" defaultChecked={s.showInStats} /> İstatistiklerde göster
                  </label>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button type="submit" formAction={deleteStatItemAction} className={styles.deleteBtn}>Sil</button>
                <button type="submit" className={styles.saveBtn}>Kaydet</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Yeni Sayaç Ekle</h2>
        <form action={saveStatItemAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Sıra</label>
              <input className={styles.input} type="number" name="order" defaultValue={items.length} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>İkon</label>
              <select className={styles.select} name="icon" defaultValue={ICON_KEYS[0]}>
                {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Önek</label>
              <input className={styles.input} name="prefix" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Değer</label>
              <input className={styles.input} type="number" name="value" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Sonek</label>
              <input className={styles.input} name="suffix" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Etiket</label>
            <input className={styles.input} name="label" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Açıklama</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="description" />
          </div>
          <div className={styles.field} style={{ flexDirection: "row", gap: 20 }}>
            <label className={styles.checkboxRow}>
              <input type="checkbox" name="showInHero" /> Hero&apos;da göster
            </label>
            <label className={styles.checkboxRow}>
              <input type="checkbox" name="showInStats" defaultChecked /> İstatistiklerde göster
            </label>
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
