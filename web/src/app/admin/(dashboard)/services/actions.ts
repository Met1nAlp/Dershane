"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveServiceAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const data = {
    order: Number(formData.get("order") ?? 0),
    icon: String(formData.get("icon") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  if (idRaw) {
    await prisma.serviceItem.update({ where: { id: Number(idRaw) }, data });
  } else {
    await prisma.serviceItem.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.serviceItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/services");
}
