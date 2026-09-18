"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { RegisterCta } from "@/components/jobs/register-cta";
import type { UserRole } from "@/lib/types/auth";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type SiteNavProps = {
  role: UserRole;
};

const navLinkClassName =
  "text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none";

const mobileNavLinkClassName =
  "text-foreground hover:bg-muted focus-visible:ring-ring flex min-h-11 w-full items-center rounded-md px-3 text-base font-medium focus-visible:ring-3 focus-visible:outline-none";

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

function isItemCurrent(pathname: string, href: string) {
  if (href === "/profil") {
    return (
      pathname.startsWith("/profil") &&
      !pathname.startsWith("/profil/penyaluran") &&
      !pathname.startsWith("/profil/cv")
    );
  }
  if (href === "/perusahaan") {
    return (
      pathname.startsWith("/perusahaan") &&
      !pathname.startsWith("/perusahaan/kandidat")
    );
  }
  return isCurrent(pathname, href);
}

export function SiteNav({ role }: SiteNavProps) {
  const pathname = usePathname();
  const onRegister = pathname.startsWith("/daftar");
  const onSignIn = pathname.startsWith("/masuk");
  const isSignedIn = role !== "tamu";
  const items = navItemsForRole(role);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        toggleRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="flex items-center">
      {/* Desktop nav */}
      <nav
        aria-label="Menu utama"
        className="hidden items-center justify-end gap-1 md:flex md:gap-2"
      >
        {items.map((item) => {
          const current = isItemCurrent(pathname, item.href);

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
            className={cn(navLinkClassName, "font-bold text-[#004a3c]")}
          >
            Masuk
          </Link>
        )}
        {isSignedIn ? null : (
          <RegisterCta compact ariaCurrent={onRegister} />
        )}
      </nav>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
          className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-md focus-visible:ring-3 focus-visible:outline-none"
        >
          {open ? (
            <X className="size-6" aria-hidden />
          ) : (
            <Menu className="size-6" aria-hidden />
          )}
        </button>

        {open ? (
          <>
            <div
              className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-[1px]"
              aria-hidden
            />
            <div
              ref={panelRef}
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label="Menu utama"
              className="border-border bg-background fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b shadow-lg"
            >
              <nav
                aria-label="Menu utama"
                className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6"
              >
                {items.map((item) => {
                  const current = isItemCurrent(pathname, item.href);

                  return (
                    <Link
                      key={`mobile-${item.href}-${item.label}`}
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        mobileNavLinkClassName,
                        current && "bg-muted font-semibold",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="border-border mt-2 flex flex-col gap-2 border-t pt-3">
                  {isSignedIn ? (
                    <SignOutButton className="w-full justify-start px-3 text-base" />
                  ) : (
                    <>
                      <Link
                        href="/masuk"
                        aria-current={onSignIn ? "page" : undefined}
                        className={cn(
                          mobileNavLinkClassName,
                          "font-bold text-[#004a3c]",
                          onSignIn && "bg-muted",
                        )}
                        onClick={() => setOpen(false)}
                      >
                        Masuk
                      </Link>
                      <RegisterCta
                        ariaCurrent={onRegister}
                        className="w-full justify-center"
                      />
                    </>
                  )}
                </div>
              </nav>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
