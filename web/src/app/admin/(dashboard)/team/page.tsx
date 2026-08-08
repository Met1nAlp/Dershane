import { prisma } from "@/lib/prisma";
import ImageUploadField from "@/components/admin/ImageUploadField";
import styles from "../../admin-ui.module.css";
import { saveTeamMemberAction, deleteTeamMemberAction } from "./actions";

export default async function AdminTeamPage() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className={styles.pageTitle}>Kadromuz</h1>
      <p className={styles.pageDesc}>Öğretmen kartları ({team.length} adet).</p>

      <div className={styles.section}>
        <div className={styles.list}>
          {team.map((t) => (
            <form key={t.id} action={saveTeamMemberAction} className={styles.listItem}>
              <input type="hidden" name="id" defaultValue={t.id} />
              <div className={styles.listItemGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Sıra</label>
                  <input className={`${styles.input} ${styles.orderField}`} type="number" name="order" defaultValue={t.order} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Fotoğraf</label>
                  <ImageUploadField name="imageUrl" defaultValue={t.imageUrl} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Ad Soyad</label>
                    <input className={styles.input} name="name" defaultValue={t.name} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Branş</label>
                    <input className={styles.input} name="branch" defaultValue={t.branch} required />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Deneyim Etiketi</label>
                    <input className={styles.input} name="experienceLabel" defaultValue={t.experienceLabel} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Kart Rengi</label>
                    <input className={styles.input} type="color" name="colorHex" defaultValue={t.colorHex} style={{ height: 42, padding: 4 }} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Detay</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} name="detail" defaultValue={t.detail} required />
                </div>
              </div>
              <div className={styles.itemActions}>
                <button type="submit" formAction={deleteTeamMemberAction} className={styles.deleteBtn}>Sil</button>
                <button type="submit" className={styles.saveBtn}>Kaydet</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Yeni Öğretmen Ekle</h2>
        <form action={saveTeamMemberAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>Sıra</label>
            <input className={styles.input} type="number" name="order" defaultValue={team.length} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Fotoğraf</label>
            <ImageUploadField name="imageUrl" defaultValue="" />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Ad Soyad</label>
              <input className={styles.input} name="name" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Branş</label>
              <input className={styles.input} name="branch" required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Deneyim Etiketi</label>
              <input className={styles.input} name="experienceLabel" placeholder="örn. 10 yıl deneyim" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Kart Rengi</label>
              <input className={styles.input} type="color" name="colorHex" defaultValue="#3b82f6" style={{ height: 42, padding: 4 }} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Detay</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="detail" required />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
