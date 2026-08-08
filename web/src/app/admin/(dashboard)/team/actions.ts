"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveTeamMemberAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const data = {
    order: Number(formData.get("order") ?? 0),
    name: String(formData.get("name") ?? ""),
    branch: String(formData.get("branch") ?? ""),
    experienceLabel: String(formData.get("experienceLabel") ?? ""),
    detail: String(formData.get("detail") ?? ""),
    colorHex: String(formData.get("colorHex") ?? "#3b82f6"),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  };

  if (idRaw) {
    await prisma.teamMember.update({ where: { id: Number(idRaw) }, data });
  } else {
    await prisma.teamMember.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/team");
}

export async function deleteTeamMemberAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/team");
}
