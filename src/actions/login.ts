"use server";

import { LoginResponse, LoginSchema } from "@/schemas/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function login(formData: LoginSchema) {
  const cookieStore = await cookies();
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const { token, success, message } =
      (await response.json()) as LoginResponse;

    if (!success || !token) {
      throw new Error(message);
    }

    cookieStore.set("access_token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      secure: true,
      sameSite: "lax",
    });
  } catch (err) {
    cookieStore.delete("access_token");
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao efetuar o login",
    };
  }

  redirect("/reports");
}
