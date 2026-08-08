"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveEventAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const data = {
    order: Number(formData.get("order") ?? 0),
    title: String(formData.get("title") ?? ""),
    tag: String(formData.get("tag") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  };

  if (idRaw) {
    await prisma.eventItem.update({ where: { id: Number(idRaw) }, data });
  } else {
    await prisma.eventItem.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/events");
}

export async function deleteEventAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.eventItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/events");
}
