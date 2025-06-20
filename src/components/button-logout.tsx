"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useTransition } from "react";
import logout from "@/actions/logout";

export default function ButtonLogout() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      variant="destructive"
      className="w-fit text-sm"
      onClick={() => startTransition(async () => await logout())}
    >
      {isPending ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : (
        <LogOut size={18} />
      )}
      Sair
    </Button>
  );
}
