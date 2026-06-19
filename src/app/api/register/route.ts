import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { dbConfigured } from "@/lib/queries";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    if (!dbConfigured()) {
      return new NextResponse(
        "Demo mode: sign-up needs a database. Use the demo account to sign in (password: demo).",
        { status: 503 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return new NextResponse("User already exists", { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Registration error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
