"use client";

import { buttonVariants } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import { clearRoleCookie } from "@/lib/auth/session-cookie";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignOutButtonProps = {
  className?: string;
  variant?: "nav" | "page";
};

export function SignOutButton({
  className,
  variant = "nav",
}: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    if (pending) {
      return;
    }
    setPending(true);
    await logout();
    clearRoleCookie();
    router.push("/masuk");
    router.refresh();
  }

  if (variant === "page") {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        disabled={pending}
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "lg",
            className: "h-auto min-h-11 px-4 whitespace-normal",
          }),
          className,
        )}
      >
        {pending ? "Keluar…" : "Keluar"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className={cn(
        "text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none disabled:opacity-60",
        className,
      )}
    >
      {pending ? "Keluar…" : "Keluar"}
    </button>
  );
}
