import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "./actions";
import AdminNav from "./AdminNav";
import styles from "./layout.module.css";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Madalyon <span>Admin</span>
        </div>
        <AdminNav />
        <form action={logoutAction}>
          <button className="btn btn-outline" type="submit" style={{ width: "100%", justifyContent: "center" }}>
            Çıkış Yap
          </button>
        </form>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
