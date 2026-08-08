"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  await createSession();
  redirect("/admin");
}
