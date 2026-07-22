import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/constants/auth";
import { verifyPassword } from "@/lib/auth";
import { createAuthToken } from "@/lib/jwt";
import { ensureSchema, sql } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { message: "Email dan kata sandi perlu diisi." },
      { status: 400 },
    );
  }

  const email = String(body.email).trim().toLowerCase();
  const password = String(body.password);

  if (!email.includes("@")) {
    return NextResponse.json({ message: "Format email belum benar." }, { status: 400 });
  }

  await ensureSchema();

  const rows = await sql`SELECT id, email, password_hash FROM users WHERE email = ${email}`;
  const user = rows[0];
  if (!user) {
    return NextResponse.json({ message: "Email atau kata sandi tidak cocok." }, { status: 401 });
  }

  const isPasswordValid = await verifyPassword(password, user.password_hash as string);
  if (!isPasswordValid) {
    return NextResponse.json({ message: "Email atau kata sandi tidak cocok." }, { status: 401 });
  }

  const token = await createAuthToken({
    userId: user.id as string,
    email: user.email as string,
  });

  const response = NextResponse.json({
    message: "Berhasil masuk",
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 2,
    path: "/",
  });

  return response;
}
