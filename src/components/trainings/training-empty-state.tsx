import { PageActionLink } from "@/components/layout/page-action-link";
import Link from "next/link";

type TrainingEmptyStateProps = {
  variant: "katalog" | "saya";
  unavailable?: boolean;
};

export function TrainingEmptyState({
  variant,
  unavailable = false,
}: TrainingEmptyStateProps) {
  if (variant === "katalog") {
    return (
      <div
        role="status"
        className="border-border bg-card rounded-xl border px-4 py-10 text-center"
      >
        <p className="text-foreground text-base font-medium">
          {unavailable
            ? "Data pelatihan sedang tidak dapat ditampilkan"
            : "Belum ada pelatihan yang tersedia"}
        </p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
          {unavailable
            ? "Layanan data sedang tidak tersedia. Muat ulang halaman ini beberapa saat lagi."
            : "Saat ini belum ada pelatihan yang dibuka. Silakan periksa kembali nanti, atau lanjutkan melengkapi profil Anda sambil menunggu jadwal pelatihan berikutnya."}
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
