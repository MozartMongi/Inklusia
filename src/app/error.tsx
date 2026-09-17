"use client";

import { buttonVariants } from "@/components/ui/button";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="mx-auto w-full max-w-3xl flex-1 scroll-mt-24 px-4 py-16 focus-visible:outline-none sm:px-6"
    >
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">
        Halaman tidak dapat dimuat
      </h1>
      <p className="text-muted-foreground mt-3 text-base leading-7">
        Terjadi kesalahan saat mengambil data. Periksa koneksi Anda, lalu coba
        lagi.
      </p>
      <p className="mt-8">
        <button
          type="button"
          onClick={() => reset()}
          className={buttonVariants({
            size: "lg",
            className: "min-h-11 px-4",
          })}
        >
          Coba lagi
        </button>
      </p>
    </main>
  );
}
