import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { loginSchema } from "@/schemas/login-form";

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecretKey() {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(JWT_SECRET);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data types!" },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { email: body.email },
    });

    const passwordIsCompatible =
      user && (await bcrypt.compare(body.password, user.password));

    if (!passwordIsCompatible) {
      return NextResponse.json(
        { success: false, message: "Incorrect credentials!" },
        { status: 401 },
      );
    }

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getJwtSecretKey());

    return NextResponse.json({
      success: true,
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
