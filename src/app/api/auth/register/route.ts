import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, name, password } = await request.json();

  const userAlreadyExists = await db.user.findFirst({ where: { email } });

  if (!userAlreadyExists) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.replace(/\s+/g, " ").trim().toLowerCase(),
        password: hashedPassword,
        role: "CLIENT",
      },
    });

    return NextResponse.json(
      { message: `User "${user.name}" created sucessfully!` },
      { status: 201 },
    );
  } else {
    return NextResponse.json(
      { error: "Email is already in use" },
      { status: 400 },
    );
  }
}
