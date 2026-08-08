"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import styles from "./login.module.css";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className={styles.wrap}>
      <form className={styles.card} action={formAction}>
        <div>
          <h1 className={styles.title}>Admin Girişi</h1>
          <p className={styles.subtitle}>Madalyon Akıl Treni içerik yönetimi</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">Kullanıcı Adı</label>
          <input id="username" name="username" type="text" required className={styles.input} autoComplete="username" />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Şifre</label>
          <input id="password" name="password" type="password" required className={styles.input} autoComplete="current-password" />
        </div>

        {state?.error && <p className={styles.error}>{state.error}</p>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isPending}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
