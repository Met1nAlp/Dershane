"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateNavbarContentAction(formData: FormData) {
  await requireAdmin();

  await prisma.navbarContent.update({
    where: { id: 1 },
    data: {
      ctaLabel: String(formData.get("ctaLabel") ?? ""),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/navbar");
}

// NavLink hem Navbar menusu hem Footer link listesi tarafindan paylasilir.
export async function saveNavLinkAction(formData: FormData) {
  await requireAdmin();

  const idRaw = formData.get("id");
  const data = {
    order: Number(formData.get("order") ?? 0),
    label: String(formData.get("label") ?? ""),
    href: String(formData.get("href") ?? ""),
  };

  if (idRaw) {
    await prisma.navLink.update({ where: { id: Number(idRaw) }, data });
  } else {
    await prisma.navLink.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/navbar");
  revalidatePath("/admin/footer");
}

export async function deleteNavLinkAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.navLink.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/navbar");
  revalidatePath("/admin/footer");
}
