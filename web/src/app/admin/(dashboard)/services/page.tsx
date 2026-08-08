import { prisma } from "@/lib/prisma";
import { ICON_KEYS } from "@/lib/icons";
import styles from "../../admin-ui.module.css";
import { saveServiceAction, deleteServiceAction } from "./actions";

export default async function AdminServicesPage() {
  const services = await prisma.serviceItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className={styles.pageTitle}>Hizmetler</h1>
      <p className={styles.pageDesc}>Anasayfada yatay kayan hizmet kartları ({services.length} adet).</p>

      <div className={styles.section}>
        <div className={styles.list}>
          {services.map((s) => (
            <form key={s.id} action={saveServiceAction} className={styles.listItem}>
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
                <div className={styles.field}>
                  <label className={styles.label}>Başlık</label>
                  <input className={styles.input} name="title" defaultValue={s.title} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Açıklama</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} name="description" defaultValue={s.description} required />
                </div>
              </div>
              <div className={styles.itemActions}>
                <button type="submit" formAction={deleteServiceAction} className={styles.deleteBtn}>Sil</button>
                <button type="submit" className={styles.saveBtn}>Kaydet</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Yeni Hizmet Ekle</h2>
        <form action={saveServiceAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Sıra</label>
              <input className={styles.input} type="number" name="order" defaultValue={services.length} />
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
            <input className={styles.input} name="title" placeholder="örn. Matematik & Geometri" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Açıklama</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="description" required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
