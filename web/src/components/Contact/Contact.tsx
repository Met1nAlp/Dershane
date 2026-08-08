"use client";

import { useState } from "react";
import { FaLocationDot, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCircleCheck } from "react-icons/fa6";
import type { ContactInfo } from "@prisma/client";
import { submitContactFormAction } from "@/lib/actions/contact";
import styles from "./Contact.module.css";

interface ContactProps {
  contact: ContactInfo;
}

export default function Contact({ contact }: ContactProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });

  const info = [
    { icon: FaLocationDot, label: "Adres", value: contact.address },
    { icon: FaPhone, label: "Telefon", value: contact.phone },
    { icon: FaEnvelope, label: "E-posta", value: contact.email },
    { icon: FaClock, label: "Çalışma Saatleri", value: contact.workingHours },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitContactFormAction(form);
      setSubmitting(false);
      if (result.ok) {
        setSent(true);
        setForm({ name: "", phone: "", email: "", note: "" });
      } else {
        setError(result.error ?? "Bir şeyler ters gitti, lütfen tekrar deneyin.");
      }
    } catch {
      setSubmitting(false);
      setError("Beklenmeyen bir hata oluştu.");
    }
  };

  return (
    <section className="section" id="iletisim" style={{ background: "var(--surface)" }}>
      <div className="container">
        <div className="section-header">
          <span className="badge">📞 Bize Ulaşın</span>
          <h2 className="section-title">İletişim & Kayıt</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ marginTop: "16px" }}>
            Kayıt, bilgi almak veya ücretsiz deneme dersi için formu doldurun, sizi arayalım.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.infoSide}>
            <div className={styles.infoCard}>
              {info.map((item, i) => (
                <div key={i} className={styles.infoRow}>
                  <div className={styles.infoIcon}>
                    <item.icon size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <div className={styles.infoLabel}>{item.label}</div>
                    <div className={styles.infoValue}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {contact.mapEmbedUrl ? (
              <iframe
                src={contact.mapEmbedUrl}
                className={styles.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Konum haritası"
              />
            ) : (
              <div className={styles.mapPlaceholder}>
                <FaLocationDot size={28} color="var(--accent)" />
                <span>Harita yakında eklenecek</span>
              </div>
            )}
          </div>

          <div className={styles.formSide}>
            {sent ? (
              <div className={styles.successBox}>
                <FaCircleCheck size={48} color="var(--accent)" />
                <h3>Mesajınız İletildi!</h3>
                <p>En kısa sürede sizi arayacağız. Tercih ettiğiniz için teşekkürler 🎉</p>
                <button className="btn btn-outline" onClick={() => setSent(false)}>Yeni Mesaj Gönder</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <h3 className={styles.formTitle}>Ücretsiz Ön Görüşme Talebi</h3>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Ad Soyad</label>
                    <input className={styles.input} type="text" placeholder="Adınızı girin" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Telefon</label>
                    <input className={styles.input} type="tel" placeholder="0555 000 00 00" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>E-posta</label>
                  <input className={styles.input} type="email" placeholder="ornek@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Not / Soru</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Hangi sınav için hazırlanıyorsunuz?" rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </div>
                {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{error}</p>}
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={submitting}>
                  <FaPaperPlane size={16} /> {submitting ? "Gönderiliyor..." : "Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
