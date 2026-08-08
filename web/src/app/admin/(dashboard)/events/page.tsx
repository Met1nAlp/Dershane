import { prisma } from "@/lib/prisma";
import ImageUploadField from "@/components/admin/ImageUploadField";
import styles from "../../admin-ui.module.css";
import { saveEventAction, deleteEventAction } from "./actions";

export default async function AdminEventsPage() {
  const events = await prisma.eventItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className={styles.pageTitle}>Etkinlikler</h1>
      <p className={styles.pageDesc}>Piknik, turnuva gibi sosyal etkinlik fotoğrafları ({events.length} adet).</p>

      <div className={styles.section}>
        <div className={styles.list}>
          {events.map((e) => (
            <form key={e.id} action={saveEventAction} className={styles.listItem}>
              <input type="hidden" name="id" defaultValue={e.id} />
              <div className={styles.listItemGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Sıra</label>
                  <input className={`${styles.input} ${styles.orderField}`} type="number" name="order" defaultValue={e.order} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Fotoğraf</label>
                  <ImageUploadField name="imageUrl" defaultValue={e.imageUrl} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Başlık</label>
                    <input className={styles.input} name="title" defaultValue={e.title} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Etiket</label>
                    <input className={styles.input} name="tag" defaultValue={e.tag} required />
                  </div>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button type="submit" formAction={deleteEventAction} className={styles.deleteBtn}>Sil</button>
                <button type="submit" className={styles.saveBtn}>Kaydet</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Yeni Etkinlik Ekle</h2>
        <form action={saveEventAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>Sıra</label>
            <input className={styles.input} type="number" name="order" defaultValue={events.length} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Fotoğraf</label>
            <ImageUploadField name="imageUrl" defaultValue="" />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Başlık</label>
              <input className={styles.input} name="title" placeholder="örn. Bahar Pikniği" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Etiket</label>
              <input className={styles.input} name="tag" placeholder="örn. Piknik" required />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
