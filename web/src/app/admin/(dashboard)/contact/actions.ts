"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateContactSectionAction(formData: FormData) {
  await requireAdmin();

  const field = (name: string) => String(formData.get(name) ?? "");

  await prisma.contactSectionContent.update({
    where: { id: 1 },
    data: {
      badge: field("badge"),
      title: field("title"),
      description: field("description"),
      infoAddressLabel: field("infoAddressLabel"),
      infoPhoneLabel: field("infoPhoneLabel"),
      infoEmailLabel: field("infoEmailLabel"),
      infoHoursLabel: field("infoHoursLabel"),
      formTitle: field("formTitle"),
      formNameLabel: field("formNameLabel"),
      formNamePlaceholder: field("formNamePlaceholder"),
      formPhoneLabel: field("formPhoneLabel"),
      formPhonePlaceholder: field("formPhonePlaceholder"),
      formEmailLabel: field("formEmailLabel"),
      formEmailPlaceholder: field("formEmailPlaceholder"),
      formNoteLabel: field("formNoteLabel"),
      formNotePlaceholder: field("formNotePlaceholder"),
      submitLabel: field("submitLabel"),
      submitLoadingLabel: field("submitLoadingLabel"),
      successTitle: field("successTitle"),
      successMessage: field("successMessage"),
      successButtonLabel: field("successButtonLabel"),
      errorGeneric: field("errorGeneric"),
      errorUnexpected: field("errorUnexpected"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/contact");
}

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
