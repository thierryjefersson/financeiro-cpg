"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");

  redirect("/login-wocody-cpg");
}
