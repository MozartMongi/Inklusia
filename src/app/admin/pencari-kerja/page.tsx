import { AdminSeekerList } from "@/components/admin/admin-seeker-list";
import { fetchAdminSeekers } from "@/lib/api/admin";
import { parseSeekerSearchFilters } from "@/lib/placements/seeker-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data pencari kerja",
  description:
    "Daftar pencari kerja dengan pencarian nama/keahlian dan saringan disabilitas serta kota.",
};

type AdminJobSeekersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminJobSeekersPage({
  searchParams,
}: AdminJobSeekersPageProps) {
  const params = await searchParams;
  const [{ seekers, cities }, filters] = await Promise.all([
    fetchAdminSeekers(params),
    Promise.resolve(parseSeekerSearchFilters(params)),
  ]);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-5xl flex-1 scroll-mt-24 px-4 py-8 focus-visible:outline-none sm:px-6 sm:py-10"
    >
      <header className="mb-8 max-w-3xl">
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Dashboard admin
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Data pencari kerja
        </h1>
        <p className="text-muted-foreground mt-3 text-base leading-7">
          Tinjau profil pencari kerja sebelum penyaluran. Gunakan pencarian dan
          saringan untuk menemukan kandidat yang sesuai.
        </p>
      </header>
      <AdminSeekerList seekers={seekers} filters={filters} cities={cities} />
    </main>
  );
}
