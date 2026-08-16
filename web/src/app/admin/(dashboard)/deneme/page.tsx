import { prisma } from "@/lib/prisma";
import ImageUploadField from "@/components/admin/ImageUploadField";
import styles from "../../admin-ui.module.css";
import { updatePracticeSectionAction, savePracticeItemAction, deletePracticeItemAction } from "./actions";

export default async function AdminPracticePage() {
  const [sectionContent, items] = await Promise.all([
    prisma.practiceSectionContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.practiceItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>Deneme ve Soru Çözümü</h1>
      <p className={styles.pageDesc}>
        Bölüm başlığı ve deneme/soru çözümü kartları ({items.length} adet).
        Sitede kartlarda fotoğraf, etiket, başlık ve açıklama görünür.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Bölüm Başlığı</h2>
        <form action={updatePracticeSectionAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>Rozet Metni</label>
            <input className={styles.input} name="badge" defaultValue={sectionContent.badge} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Başlık</label>
            <input className={styles.input} name="title" defaultValue={sectionContent.title} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Açıklama</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="description" defaultValue={sectionContent.description} required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Kartlar ({items.length})</h2>
        <div className={styles.list}>
          {items.map((p) => (
            <form key={p.id} action={savePracticeItemAction} className={styles.listItem}>
              <input type="hidden" name="id" defaultValue={p.id} />
              <div className={styles.listItemGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Sıra</label>
                  <input className={`${styles.input} ${styles.orderField}`} type="number" name="order" defaultValue={p.order} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Fotoğraf</label>
                  <ImageUploadField name="imageUrl" defaultValue={p.imageUrl} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Başlık</label>
                    <input className={styles.input} name="title" defaultValue={p.title} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Etiket</label>
                    <input className={styles.input} name="tag" defaultValue={p.tag} required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Açıklama</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} name="description" defaultValue={p.description} />
                </div>
              </div>
              <div className={styles.itemActions}>
                <button type="submit" formAction={deletePracticeItemAction} className={styles.deleteBtn}>Sil</button>
                <button type="submit" className={styles.saveBtn}>Kaydet</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Yeni Kart Ekle</h2>
        <form action={savePracticeItemAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>Sıra</label>
            <input className={styles.input} type="number" name="order" defaultValue={items.length} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Fotoğraf</label>
            <ImageUploadField name="imageUrl" defaultValue="" />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Başlık</label>
              <input className={styles.input} name="title" placeholder="örn. TYT Haftalık Deneme" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Etiket</label>
              <input className={styles.input} name="tag" placeholder="örn. TYT" required />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Açıklama</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="description" placeholder="Kısa bir açıklama" />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
