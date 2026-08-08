"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateContactInfoAction(formData: FormData) {
  await requireAdmin();

  const mapEmbedUrl = String(formData.get("mapEmbedUrl") ?? "").trim();

  await prisma.contactInfo.update({
    where: { id: 1 },
    data: {
      address: String(formData.get("address") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      workingHours: String(formData.get("workingHours") ?? ""),
      mapEmbedUrl: mapEmbedUrl || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/contact");
}

export async function markMessageReadAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}
