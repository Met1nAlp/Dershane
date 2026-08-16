import { prisma } from "@/lib/prisma";
import styles from "../../admin-ui.module.css";
import {
  updateContactSectionAction,
  updateContactInfoAction,
  markMessageReadAction,
  deleteMessageAction,
} from "./actions";

export default async function AdminContactPage() {
  const [sectionContent, contact, messages] = await Promise.all([
    prisma.contactSectionContent.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.contactInfo.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>İletişim</h1>
      <p className={styles.pageDesc}>Bölüm başlığı, form metinleri, iletişim bilgileri ve siteden gelen mesajlar.</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Bölüm Başlığı</h2>
        <form action={updateContactSectionAction} className={`${styles.card} ${styles.form}`}>
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

          <p className={styles.hint} style={{ marginTop: 8 }}>İletişim Bilgisi Etiketleri</p>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Adres Etiketi</label>
              <input className={styles.input} name="infoAddressLabel" defaultValue={sectionContent.infoAddressLabel} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Telefon Etiketi</label>
              <input className={styles.input} name="infoPhoneLabel" defaultValue={sectionContent.infoPhoneLabel} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>E-posta Etiketi</label>
              <input className={styles.input} name="infoEmailLabel" defaultValue={sectionContent.infoEmailLabel} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Çalışma Saatleri Etiketi</label>
              <input className={styles.input} name="infoHoursLabel" defaultValue={sectionContent.infoHoursLabel} required />
            </div>
          </div>
          <p className={styles.hint} style={{ marginTop: 8 }}>Form Metinleri</p>
          <div className={styles.field}>
            <label className={styles.label}>Form Başlığı</label>
            <input className={styles.input} name="formTitle" defaultValue={sectionContent.formTitle} required />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Ad Soyad Etiketi</label>
              <input className={styles.input} name="formNameLabel" defaultValue={sectionContent.formNameLabel} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ad Soyad Placeholder</label>
              <input className={styles.input} name="formNamePlaceholder" defaultValue={sectionContent.formNamePlaceholder} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Telefon Etiketi</label>
              <input className={styles.input} name="formPhoneLabel" defaultValue={sectionContent.formPhoneLabel} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Telefon Placeholder</label>
              <input className={styles.input} name="formPhonePlaceholder" defaultValue={sectionContent.formPhonePlaceholder} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>E-posta Etiketi</label>
              <input className={styles.input} name="formEmailLabel" defaultValue={sectionContent.formEmailLabel} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>E-posta Placeholder</label>
              <input className={styles.input} name="formEmailPlaceholder" defaultValue={sectionContent.formEmailPlaceholder} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Not/Soru Etiketi</label>
              <input className={styles.input} name="formNoteLabel" defaultValue={sectionContent.formNoteLabel} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Not/Soru Placeholder</label>
              <input className={styles.input} name="formNotePlaceholder" defaultValue={sectionContent.formNotePlaceholder} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Gönder Buton Metni</label>
              <input className={styles.input} name="submitLabel" defaultValue={sectionContent.submitLabel} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Gönderiliyor Metni</label>
              <input className={styles.input} name="submitLoadingLabel" defaultValue={sectionContent.submitLoadingLabel} required />
            </div>
          </div>

          <p className={styles.hint} style={{ marginTop: 8 }}>Başarı / Hata Mesajları</p>
          <div className={styles.field}>
            <label className={styles.label}>Başarı Başlığı</label>
            <input className={styles.input} name="successTitle" defaultValue={sectionContent.successTitle} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Başarı Mesajı</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="successMessage" defaultValue={sectionContent.successMessage} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>&quot;Yeni Mesaj Gönder&quot; Buton Metni</label>
            <input className={styles.input} name="successButtonLabel" defaultValue={sectionContent.successButtonLabel} required />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Genel Hata Mesajı</label>
              <input className={styles.input} name="errorGeneric" defaultValue={sectionContent.errorGeneric} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Beklenmeyen Hata Mesajı</label>
              <input className={styles.input} name="errorUnexpected" defaultValue={sectionContent.errorUnexpected} required />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>İletişim Bilgileri</h2>
        <form action={updateContactInfoAction} className={`${styles.card} ${styles.form}`}>
          <div className={styles.field}>
            <label className={styles.label}>Adres</label>
            <input className={styles.input} name="address" defaultValue={contact.address} required />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Telefon</label>
              <input className={styles.input} name="phone" defaultValue={contact.phone} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>E-posta</label>
              <input className={styles.input} type="email" name="email" defaultValue={contact.email} required />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Çalışma Saatleri</label>
            <input className={styles.input} name="workingHours" defaultValue={contact.workingHours} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Google Maps Embed URL (opsiyonel)</label>
            <input className={styles.input} name="mapEmbedUrl" defaultValue={contact.mapEmbedUrl ?? ""} placeholder="https://www.google.com/maps/embed?..." />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>Kaydet</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Gelen Mesajlar ({messages.length})</h2>
        {messages.length === 0 ? (
          <p className={styles.hint}>Henüz mesaj yok.</p>
        ) : (
          <div className={styles.list}>
            {messages.map((m) => (
              <div key={m.id} className={styles.listItem} style={{ opacity: m.read ? 0.65 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <strong style={{ color: "var(--primary)" }}>{m.name}</strong>
                    {!m.read && (
                      <span style={{ marginLeft: 8, fontSize: "0.7rem", background: "var(--accent)", color: "#fff", borderRadius: 999, padding: "2px 8px" }}>
                        Yeni
                      </span>
                    )}
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {m.phone}{m.email ? ` · ${m.email}` : ""} · {m.createdAt.toLocaleString("tr-TR")}
                    </div>
                  </div>
                </div>
                {m.note && <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: 12 }}>{m.note}</p>}
                <div className={styles.itemActions}>
                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" defaultValue={m.id} />
                    <button type="submit" className={styles.deleteBtn}>Sil</button>
                  </form>
                  {!m.read && (
                    <form action={markMessageReadAction}>
                      <input type="hidden" name="id" defaultValue={m.id} />
                      <button type="submit" className={styles.saveBtn}>Okundu İşaretle</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
