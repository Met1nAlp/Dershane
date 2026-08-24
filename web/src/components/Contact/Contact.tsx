"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaLocationDot, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCircleCheck } from "react-icons/fa6";
import type { ContactInfo, ContactSectionContent } from "@prisma/client";
import { submitContactFormAction } from "@/lib/actions/contact";
import styles from "./Contact.module.css";

interface ContactProps {
  sectionContent: ContactSectionContent;
  contact: ContactInfo;
}

export default function Contact({ sectionContent, contact }: ContactProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });

  const info = [
    { icon: FaLocationDot, label: sectionContent.infoAddressLabel, value: contact.address },
    { icon: FaPhone, label: sectionContent.infoPhoneLabel, value: contact.phone },
    { icon: FaEnvelope, label: sectionContent.infoEmailLabel, value: contact.email },
    { icon: FaClock, label: sectionContent.infoHoursLabel, value: contact.workingHours },
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
        setError(result.error ?? sectionContent.errorGeneric);
      }
    } catch {
      setSubmitting(false);
      setError(sectionContent.errorUnexpected);
    }
  };

  return (
    <section
      className="section brand-watermark"
      id="iletisim"
      style={{ background: "var(--surface)", position: "relative" }}
    >
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="badge">{sectionContent.badge}</span>
          <h2 className="section-title">{sectionContent.title}</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ marginTop: "16px" }}>
            {sectionContent.description}
          </p>
        </motion.div>

        <div className={styles.layout}>
          <motion.div
            className={styles.infoSide}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
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
                <span>{sectionContent.mapPlaceholderText}</span>
              </div>
            )}
          </motion.div>

          <motion.div
            className={styles.formSide}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sent ? (
              <div className={styles.successBox}>
                <FaCircleCheck size={48} color="var(--accent)" />
                <h3>{sectionContent.successTitle}</h3>
                <p>{sectionContent.successMessage}</p>
                <button className="btn btn-outline" onClick={() => setSent(false)}>{sectionContent.successButtonLabel}</button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <h3 className={styles.formTitle}>{sectionContent.formTitle}</h3>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>{sectionContent.formNameLabel}</label>
                    <input className={styles.input} type="text" placeholder={sectionContent.formNamePlaceholder} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>{sectionContent.formPhoneLabel}</label>
                    <input className={styles.input} type="tel" placeholder={sectionContent.formPhonePlaceholder} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{sectionContent.formEmailLabel}</label>
                  <input className={styles.input} type="email" placeholder={sectionContent.formEmailPlaceholder} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{sectionContent.formNoteLabel}</label>
                  <textarea className={`${styles.input} ${styles.textarea}`} placeholder={sectionContent.formNotePlaceholder} rows={4} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </div>
                {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{error}</p>}
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={submitting}>
                  <FaPaperPlane size={16} /> {submitting ? sectionContent.submitLoadingLabel : sectionContent.submitLabel}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
