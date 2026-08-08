import { prisma } from "@/lib/prisma";
import { ICON_KEYS } from "@/lib/icons";
import styles from "../../admin-ui.module.css";
import {
  updateSiteSettingsAction,
  saveSocialLinkAction,
  deleteSocialLinkAction,
  changeAdminCredentialsAction,
} from "./actions";

const SOCIAL_ICON_KEYS = ["instagram", "whatsapp", "twitter", "youtube", "facebook"];

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ credError?: string; credSuccess?: string }>;
}) {
  const params = await searchParams;
  const [siteSettings, socialLinks, adminUser] = await Promise.all([
    prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.adminUser.findUniqueOrThrow({ where: { id: 1 } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>Ayarlar</h1>
      <p className={styles.pageDesc}>Marka bilgisi, sosyal medya linkleri ve admin giriş bilgileri.</p>

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
                  <label className={styles.label}>Platform</label>
                  <select className={styles.select} name="platform" defaultValue={s.platform}>
                    {SOCIAL_ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
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
                <label className={styles.label}>Platform</label>
                <select className={styles.select} name="platform" defaultValue={SOCIAL_ICON_KEYS[0]}>
                  {SOCIAL_ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
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
