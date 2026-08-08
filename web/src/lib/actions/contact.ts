"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

interface ContactFormInput {
  name: string;
  phone: string;
  email: string;
  note: string;
}

export async function submitContactFormAction(input: ContactFormInput): Promise<{ ok: boolean; error?: string }> {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();
  const note = input.note.trim();

  if (!name || !phone) {
    return { ok: false, error: "Ad soyad ve telefon zorunludur." };
  }

  await prisma.contactMessage.create({
    data: {
      name,
      phone,
      email: email || null,
      note: note || null,
    },
  });

  revalidatePath("/admin/contact");
  revalidatePath("/admin");

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL;

  if (resendKey && notifyEmail) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Madalyon Akıl Treni Web <onboarding@resend.dev>",
        to: notifyEmail,
        subject: `Yeni iletişim formu mesajı — ${name}`,
        text: `Ad Soyad: ${name}\nTelefon: ${phone}\nE-posta: ${email || "-"}\n\nNot:\n${note || "-"}`,
      });
    } catch (err) {
      // E-posta gönderimi başarısız olsa da mesaj DB'ye kaydedildiği için formu başarısız saymıyoruz.
      console.error("İletişim formu bildirim e-postası gönderilemedi:", err);
    }
  }

  return { ok: true };
}
