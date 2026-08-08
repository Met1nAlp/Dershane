"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateAboutAction(formData: FormData) {
  await requireAdmin();

  await prisma.aboutContent.update({
    where: { id: 1 },
    data: {
      badge: String(formData.get("badge") ?? ""),
      titleLine1: String(formData.get("titleLine1") ?? ""),
      titleAccent: String(formData.get("titleAccent") ?? ""),
      description: String(formData.get("description") ?? ""),
      foundingYear: String(formData.get("foundingYear") ?? ""),
      foundingLabel: String(formData.get("foundingLabel") ?? ""),
      foundingSub: String(formData.get("foundingSub") ?? ""),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/about");
}

export async function savePillarAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const data = {
    order: Number(formData.get("order") ?? 0),
    icon: String(formData.get("icon") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    highlight: String(formData.get("highlight") ?? ""),
  };

  if (idRaw) {
    await prisma.aboutPillar.update({ where: { id: Number(idRaw) }, data });
  } else {
    await prisma.aboutPillar.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/about");
}

export async function deletePillarAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.aboutPillar.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/about");
}
