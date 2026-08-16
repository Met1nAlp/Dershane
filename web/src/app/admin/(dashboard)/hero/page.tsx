import Link from "next/link";
import { prisma } from "@/lib/prisma";
import styles from "../../admin-ui.module.css";
import { updateHeroAction } from "./actions";

export default async function AdminHeroPage() {
  const hero = await prisma.heroContent.findUniqueOrThrow({ where: { id: 1 } });

  return (
    <div>
      <h1 className={styles.pageTitle}>Hero</h1>
      <p className={styles.pageDesc}>
        Sitenin en üstündeki ana bölüm. Sayaçlar (2.400+, 150+, 18 gibi) için{" "}
        <Link href="/admin/basarilar" style={{ color: "var(--accent)" }}>Başarılar</Link> sayfasına bakın.
      </p>

      <form action={updateHeroAction} className={`${styles.card} ${styles.form}`}>
        <div className={styles.field}>
          <label className={styles.label}>Rozet Metni</label>
          <input className={styles.input} name="badge" defaultValue={hero.badge} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Ana Başlık</label>
          <input className={styles.input} name="headingLine1" defaultValue={hero.headingLine1} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Dönen Kelimeler (virgülle ayırın)</label>
          <input className={styles.input} name="rotatingWords" defaultValue={hero.rotatingWords.join(", ")} required />
          <span className={styles.hint}>Başlığın altında sırayla değişen kelimeler, örn: Yanındayız, Rehberiniz, Destekçiniz</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Alt Metin</label>
          <textarea className={`${styles.input} ${styles.textarea}`} name="subtext" defaultValue={hero.subtext} required />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Birincil Buton Metni</label>
            <input className={styles.input} name="primaryCtaLabel" defaultValue={hero.primaryCtaLabel} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>İkincil Buton Metni</label>
            <input className={styles.input} name="secondaryCtaLabel" defaultValue={hero.secondaryCtaLabel} required />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>Kaydet</button>
        </div>
      </form>
    </div>
  );
}
