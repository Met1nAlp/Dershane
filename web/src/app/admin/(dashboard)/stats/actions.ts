"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateStatsSectionAction(formData: FormData) {
  await requireAdmin();

  await prisma.statsSectionContent.update({
    where: { id: 1 },
    data: {
      badge: String(formData.get("badge") ?? ""),
      titleLine1: String(formData.get("titleLine1") ?? ""),
      titleLine2: String(formData.get("titleLine2") ?? ""),
      description: String(formData.get("description") ?? ""),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/stats");
}

export async function saveStatItemAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const prefix = String(formData.get("prefix") ?? "").trim();
  const suffix = String(formData.get("suffix") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const data = {
    order: Number(formData.get("order") ?? 0),
    icon: String(formData.get("icon") ?? ""),
    value: Number(formData.get("value") ?? 0),
    prefix: prefix || null,
    suffix: suffix || null,
    label: String(formData.get("label") ?? ""),
    description: description || null,
    showInHero: formData.get("showInHero") === "on",
    showInStats: formData.get("showInStats") === "on",
  };

  if (idRaw) {
    await prisma.statItem.update({ where: { id: Number(idRaw) }, data });
  } else {
    await prisma.statItem.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/stats");
}

export async function deleteStatItemAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.statItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/stats");
}
