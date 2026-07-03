"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";

export async function loginAction(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Server error: ADMIN_PASSWORD not configured." };
  }

  if (password !== adminPassword) {
    return { error: "Invalid password." };
  }

  // Create JWT session
  const session = await encrypt({ isAdmin: true, time: Date.now() });

  // Save session in a secure HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
