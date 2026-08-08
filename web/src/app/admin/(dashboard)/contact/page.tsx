import { prisma } from "@/lib/prisma";
import styles from "../../admin-ui.module.css";
import { updateContactInfoAction, markMessageReadAction, deleteMessageAction } from "./actions";

export default async function AdminContactPage() {
  const [contact, messages] = await Promise.all([
    prisma.contactInfo.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>İletişim</h1>
      <p className={styles.pageDesc}>İletişim bilgileri ve siteden gelen form mesajları.</p>

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
