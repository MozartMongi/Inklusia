import { buttonVariants } from "@/components/ui/button";
import { USER_ROLE_LABEL, type UserRole } from "@/lib/types/auth";
import Link from "next/link";

type SeekerAccessDeniedProps = {
  role: UserRole;
};

export function SeekerAccessDenied({ role }: SeekerAccessDeniedProps) {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-16 focus-visible:outline-none sm:px-6"
    >
      <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
        Ruang pencari kerja
      </p>
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">
        Akses ditolak
      </h1>
      <p className="text-muted-foreground mt-3 text-base leading-7" role="status">
        Halaman ini hanya untuk akun pencari kerja. Saat ini Anda
        {role === "tamu"
          ? " belum masuk"
          : ` masuk sebagai ${USER_ROLE_LABEL[role]}`}
        .
      </p>
      <p className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/lowongan"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "min-h-11 px-4",
          })}
        >
          Kembali ke daftar lowongan
        </Link>
        <Link
          href="/masuk"
          className={buttonVariants({
            size: "lg",
            className: "min-h-11 px-4",
          })}
        >
          Masuk sebagai pencari kerja
        </Link>
      </p>
    </main>
  );
}
