import { BrandLogo } from "@/components/brand/brand-logo";
import { SiteNav } from "@/components/layout/site-nav";
import { fetchUiSession } from "@/lib/auth/session";
import Link from "next/link";

export async function SiteHeader() {
  const session = await fetchUiSession();

  return (
    <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-x-3 px-4 py-2 sm:px-6">
        <Link
          href="/"
          aria-label="Inklusia"
          className="focus-visible:ring-ring inline-flex min-h-11 max-w-[min(100%,12rem)] items-center rounded-md sm:max-w-none focus-visible:ring-3 focus-visible:outline-none"
        >
          <BrandLogo decorative priority />
        </Link>
        <SiteNav role={session.role} />
      </div>
    </header>
  );
}
