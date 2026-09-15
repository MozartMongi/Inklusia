"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { RegisterCta } from "@/components/jobs/register-cta";
import type { UserRole } from "@/lib/types/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SiteNavProps = {
  role: UserRole;
};

export function SiteNav({ role }: SiteNavProps) {
  const pathname = usePathname();
  const onJobs = pathname === "/" || pathname.startsWith("/lowongan");
  const onMyStatus = pathname.startsWith("/profil/penyaluran");
  const onCv = pathname.startsWith("/profil/cv");
  const onTraining = pathname.startsWith("/pelatihan");
  const onProfile = pathname.startsWith("/profil") && !onMyStatus && !onCv;
  const onPlacement = pathname.startsWith("/admin/penyaluran");
  const onCompanyCandidates = pathname.startsWith("/perusahaan/kandidat");
  const onCompany =
    pathname.startsWith("/perusahaan") && !onCompanyCandidates;
  const onRegister = pathname.startsWith("/daftar");
  const onSignIn = pathname.startsWith("/masuk");
  const isSignedIn = role !== "tamu";

  return (
    <nav
      aria-label="Menu utama"
      className="flex max-w-full flex-wrap items-center justify-end gap-1 sm:gap-2"
    >
      <Link
        href="/"
        aria-current={onJobs ? "page" : undefined}
        className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      >
        Lowongan
      </Link>
      <Link
        href="/profil"
        aria-current={onProfile ? "page" : undefined}
        className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      >
        Profil
      </Link>
      <Link
        href="/profil/cv"
        aria-current={onCv ? "page" : undefined}
        className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      >
        CV
      </Link>
      <Link
        href="/pelatihan"
        aria-current={onTraining ? "page" : undefined}
        className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      >
        Pelatihan
      </Link>
      <Link
        href="/profil/penyaluran"
        aria-current={onMyStatus ? "page" : undefined}
        className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      >
        Status
      </Link>
      <Link
        href="/admin/penyaluran"
        aria-current={onPlacement ? "page" : undefined}
        className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      >
        Penyaluran
      </Link>
      <Link
        href="/perusahaan"
        aria-current={onCompany ? "page" : undefined}
        className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      >
        Perusahaan
      </Link>
      <Link
        href="/perusahaan/kandidat"
        aria-current={onCompanyCandidates ? "page" : undefined}
        className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
      >
        Kandidat
      </Link>
      {isSignedIn ? (
        <SignOutButton />
      ) : (
        <Link
          href="/masuk"
          aria-current={onSignIn ? "page" : undefined}
          className="text-foreground hover:bg-muted focus-visible:ring-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:outline-none"
        >
          Masuk
        </Link>
      )}
      <RegisterCta compact ariaCurrent={onRegister} />
    </nav>
  );
}
