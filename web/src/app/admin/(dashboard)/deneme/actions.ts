"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updatePracticeSectionAction(formData: FormData) {
  await requireAdmin();

  await prisma.practiceSectionContent.update({
    where: { id: 1 },
    data: {
      badge: String(formData.get("badge") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/deneme");
}

export async function savePracticeItemAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const data = {
    order: Number(formData.get("order") ?? 0),
    title: String(formData.get("title") ?? ""),
    tag: String(formData.get("tag") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  };

  if (idRaw) {
    await prisma.practiceItem.update({ where: { id: Number(idRaw) }, data });
  } else {
    await prisma.practiceItem.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/deneme");
}

export async function deletePracticeItemAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.practiceItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/deneme");
}
