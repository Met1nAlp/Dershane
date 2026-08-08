import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Migrate/Studio gibi CLI komutları Supabase'in pooler'ı (pgbouncer) üzerinden
  // DDL çalıştıramaz, bu yüzden CLI için ayrı, doğrudan bağlantı kullanılıyor.
  // Uygulamanın kendisi (src/lib/prisma.ts) çalışma zamanında DATABASE_URL'i kullanır.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
