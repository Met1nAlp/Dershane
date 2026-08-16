import { prisma } from "@/lib/prisma";
import styles from "../../admin-ui.module.css";
import { updateSiteSettingsAction, changeAdminCredentialsAction } from "./actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ credError?: string; credSuccess?: string }>;
}) {
  const params = await searchParams;
  const [siteSettings, adminUser] = await Promise.all([
    prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.adminUser.findUniqueOrThrow({ where: { id: 1 } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>Ayarlar</h1>
      <p className={styles.pageDesc}>Marka bilgisi ve admin giriş bilgileri.</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Marka</h2>
        <form action={updateSiteSettingsAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Marka Adı</label>
              <input className={styles.input} name="brandName" defaultValue={siteSettings.brandName} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Slogan</label>
              <input className={styles.input} name="brandTagline" defaultValue={siteSettings.brandTagline} required />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Admin Giriş Bilgileri</h2>
        {params.credError && <p style={{ color: "#ef4444", marginBottom: 12 }}>Mevcut şifre hatalı, değişiklik yapılmadı.</p>}
        {params.credSuccess && <p style={{ color: "#10b981", marginBottom: 12 }}>Giriş bilgileriniz güncellendi.</p>}
        <form action={changeAdminCredentialsAction} className={`${styles.card} ${styles.form}`}>
          <p className={styles.hint}>Mevcut kullanıcı adı: <strong>{adminUser.username}</strong></p>
          <div className={styles.field}>
            <label className={styles.label}>Mevcut Şifre (zorunlu)</label>
            <input className={styles.input} type="password" name="currentPassword" required />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Yeni Kullanıcı Adı (opsiyonel)</label>
              <input className={styles.input} name="newUsername" placeholder="Boş bırakırsanız değişmez" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Yeni Şifre (opsiyonel)</label>
              <input className={styles.input} type="password" name="newPassword" placeholder="Boş bırakırsanız değişmez" />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Güncelle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
