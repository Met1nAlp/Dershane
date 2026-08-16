"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      brandName: String(formData.get("brandName") ?? ""),
      brandTagline: String(formData.get("brandTagline") ?? ""),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function changeAdminCredentialsAction(formData: FormData) {
  await requireAdmin();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newUsername = String(formData.get("newUsername") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");

  const admin = await prisma.adminUser.findUniqueOrThrow({ where: { id: 1 } });
  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) {
    redirect("/admin/settings?credError=1");
  }

  const data: { username?: string; passwordHash?: string } = {};
  if (newUsername && newUsername !== admin.username) data.username = newUsername;
  if (newPassword) data.passwordHash = await bcrypt.hash(newPassword, 10);

  if (Object.keys(data).length > 0) {
    await prisma.adminUser.update({ where: { id: 1 }, data });
  }

  redirect("/admin/settings?credSuccess=1");
}
