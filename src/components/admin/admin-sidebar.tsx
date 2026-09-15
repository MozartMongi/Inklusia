"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";
import {
  Building2,
  LayoutDashboard,
  ListChecks,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Ringkasan",
    icon: LayoutDashboard,
    match: (pathname: string) => pathname === "/admin",
  },
  {
    href: "/admin/pencari-kerja",
    label: "Pencari kerja",
    icon: UserRound,
    match: (pathname: string) => pathname.startsWith("/admin/pencari-kerja"),
  },
  {
    href: "/admin/perusahaan",
    label: "Perusahaan",
    icon: Building2,
    match: (pathname: string) => pathname.startsWith("/admin/perusahaan"),
  },
  {
    href: "/admin/penyaluran",
    label: "Penyaluran",
    icon: Users,
    match: (pathname: string) =>
      pathname === "/admin/penyaluran" ||
      (pathname.startsWith("/admin/penyaluran/") &&
        !pathname.startsWith("/admin/penyaluran/riwayat")),
  },
  {
    href: "/admin/penyaluran/riwayat",
    label: "Riwayat penyaluran",
    icon: ListChecks,
    match: (pathname: string) =>
      pathname.startsWith("/admin/penyaluran/riwayat"),
  },
  {
    href: "/admin/akun",
    label: "Akun admin",
    icon: Shield,
    match: (pathname: string) => pathname.startsWith("/admin/akun"),
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navigasi dashboard admin"
      className="border-border bg-card flex w-full flex-col gap-6 border-b p-4 md:w-64 md:shrink-0 md:border-r md:border-b-0 md:py-6"
    >
      <div className="flex flex-col gap-2">
        <Link
          href="/admin"
          className="focus-visible:ring-ring inline-flex max-w-full items-center rounded-md focus-visible:ring-3 focus-visible:outline-none"
        >
          <BrandLogo decorative className="h-9" />
        </Link>
        <p className="text-muted-foreground text-sm">Dashboard admin</p>
      </div>
      <nav aria-label="Menu admin" className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const current = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium focus-visible:ring-3 focus-visible:outline-none",
                current
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted focus-visible:ring-ring",
              )}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
        <Link
          href="/"
          className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium focus-visible:ring-3 focus-visible:outline-none"
        >
          Ke portal publik
        </Link>
        <SignOutButton className="justify-start px-3" />
      </div>
    </aside>
  );
}
