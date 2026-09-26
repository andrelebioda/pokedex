"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/server/db/prisma";

interface RegisterUserResult {
  success: boolean;
  error?: string;
}

const SALT_ROUNDS = 10;

export async function registerUser(email: string, password: string, name?: string): Promise<RegisterUserResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { success: false, error: "E-Mail und Passwort werden benötigt." };
  }

  if (password.length < 8) {
    return { success: false, error: "Das Passwort muss mindestens 8 Zeichen lang sein." };
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return { success: false, error: "Für diese E-Mail existiert bereits ein Konto." };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.user.create({
    data: { email: normalizedEmail, password: passwordHash, name: name?.trim() || null },
  });

  return { success: true };
}
