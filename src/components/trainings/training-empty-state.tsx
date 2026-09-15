import { PageActionLink } from "@/components/layout/page-action-link";
import Link from "next/link";

type TrainingEmptyStateProps = {
  variant: "katalog" | "saya";
};

export function TrainingEmptyState({ variant }: TrainingEmptyStateProps) {
  if (variant === "katalog") {
    return (
      <div
        role="status"
        className="border-border bg-card rounded-xl border px-4 py-10 text-center"
      >
        <p className="text-foreground text-base font-medium">
          Katalog pelatihan masih kosong
        </p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
          Belum ada pelatihan yang dapat ditampilkan saat ini. Periksa lagi
          nanti, atau kembali ke profil untuk melanjutkan persiapan kerja.
        </p>
        <p className="mt-5">
          <PageActionLink href="/profil" tone="back">
            Kembali ke profil
          </PageActionLink>
        </p>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="border-border bg-card rounded-xl border px-4 py-10 text-center"
    >
      <p className="text-foreground text-base font-medium">
        Belum ada pelatihan yang diikuti
      </p>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
        Jelajahi katalog pelatihan dan daftar pada topik yang ingin Anda
        kuasai. Status pendaftaran akan muncul di sini.
      </p>
      <p className="mt-5">
        <Link
          href="/pelatihan"
          className="text-primary text-sm font-medium underline-offset-4 hover:underline"
        >
          Lihat daftar pelatihan
        </Link>
      </p>
    </div>
  );
}
