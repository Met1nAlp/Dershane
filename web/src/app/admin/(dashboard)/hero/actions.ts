"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateHeroAction(formData: FormData) {
  await requireAdmin();

  const rotatingWords = String(formData.get("rotatingWords") ?? "")
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

  await prisma.heroContent.update({
    where: { id: 1 },
    data: {
      badge: String(formData.get("badge") ?? ""),
      headingLine1: String(formData.get("headingLine1") ?? ""),
      subtext: String(formData.get("subtext") ?? ""),
      primaryCtaLabel: String(formData.get("primaryCtaLabel") ?? ""),
      secondaryCtaLabel: String(formData.get("secondaryCtaLabel") ?? ""),
      rotatingWords,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/hero");
}
