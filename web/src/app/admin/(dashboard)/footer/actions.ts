"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateFooterContentAction(formData: FormData) {
  await requireAdmin();

  await prisma.footerContent.update({
    where: { id: 1 },
    data: {
      copyrightSuffix: String(formData.get("copyrightSuffix") ?? ""),
      creditLine: String(formData.get("creditLine") ?? ""),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/footer");
}

export async function saveSocialLinkAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const data = {
    order: Number(formData.get("order") ?? 0),
    platform: String(formData.get("platform") ?? ""),
    url: String(formData.get("url") ?? ""),
  };

  if (idRaw) {
    await prisma.socialLink.update({ where: { id: Number(idRaw) }, data });
  } else {
    await prisma.socialLink.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/footer");
}

export async function deleteSocialLinkAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/footer");
}
