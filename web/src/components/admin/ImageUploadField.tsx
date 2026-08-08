"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import styles from "@/app/admin/admin-ui.module.css";

interface ImageUploadFieldProps {
  name: string;
  defaultValue: string;
}

export default function ImageUploadField({ name, defaultValue }: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      setUrl(blob.url);
    } catch {
      setError("Yükleme başarısız oldu. Tekrar deneyin.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {url && <img src={url} alt="" className={styles.imagePreview} />}
      <input type="hidden" name={name} value={url} />
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <span className={styles.hint}>Yükleniyor...</span>}
      {error && <span style={{ color: "#ef4444", fontSize: "0.8rem" }}>{error}</span>}
    </div>
  );
}
