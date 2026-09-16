"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { RegisterCta } from "@/components/jobs/register-cta";
import type { UserRole } from "@/lib/types/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SiteNavProps = {
  role: UserRole;
};

const navLinkClassName =
  "text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none";

function isCurrent(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navItemsForRole(role: UserRole) {
  const seekerItems = [
    { href: "/", label: "Beranda" },
    { href: "/lowongan", label: "Lowongan" },
    { href: "/profil", label: "Profil" },
    { href: "/profil/cv", label: "CV" },
    { href: "/pelatihan", label: "Pelatihan" },
    { href: "/profil/penyaluran", label: "Status" },
  ];
  const companyItems = [
    { href: "/", label: "Beranda" },
    { href: "/lowongan", label: "Lowongan" },
    { href: "/perusahaan", label: "Perusahaan" },
    { href: "/perusahaan/kandidat", label: "Kandidat" },
  ];
  const adminItems = [{ href: "/admin/penyaluran", label: "Penyaluran" }];
  const guestItems = [
    { href: "/", label: "Beranda" },
    { href: "/lowongan", label: "Lowongan" },
    { href: "/pelatihan", label: "Pelatihan" },
  ];

  if (role === "pencari_kerja") {
    return seekerItems;
  }
  if (role === "perusahaan") {
    return companyItems;
  }
  if (role === "admin") {
    return adminItems;
  }
  return guestItems;
}

export function SiteNav({ role }: SiteNavProps) {
  const pathname = usePathname();
  const onRegister = pathname.startsWith("/daftar");
  const onSignIn = pathname.startsWith("/masuk");
  const isSignedIn = role !== "tamu";
  const items = navItemsForRole(role);

  return (
    <nav
      aria-label="Menu utama"
      className="flex max-w-full flex-wrap items-center justify-end gap-1 sm:gap-2"
    >
      {items.map((item) => {
        const current =
          item.href === "/profil"
            ? pathname.startsWith("/profil") &&
              !pathname.startsWith("/profil/penyaluran") &&
              !pathname.startsWith("/profil/cv")
            : item.href === "/perusahaan"
              ? pathname.startsWith("/perusahaan") &&
                !pathname.startsWith("/perusahaan/kandidat")
              : isCurrent(pathname, item.href);

        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={navLinkClassName}
          >
            {item.label}
          </Link>
        );
      })}
      {isSignedIn ? (
        <SignOutButton />
      ) : (
        <Link
          href="/masuk"
          aria-current={onSignIn ? "page" : undefined}
          className={navLinkClassName}
        >
          Masuk
        </Link>
      )}
      {isSignedIn ? null : (
        <RegisterCta compact ariaCurrent={onRegister} />
      )}
    </nav>
  );
}
