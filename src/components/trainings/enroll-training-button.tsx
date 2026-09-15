"use client";

import { buttonVariants } from "@/components/ui/button";
import { enrollInTraining } from "@/lib/api/trainings";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

type EnrollTrainingButtonProps = {
  trainingId: string;
  trainingTitle: string;
  alreadyEnrolled?: boolean;
  seatsLeft: number;
};

export function EnrollTrainingButton({
  trainingId,
  trainingTitle,
  alreadyEnrolled = false,
  seatsLeft,
}: EnrollTrainingButtonProps) {
  const router = useRouter();
  const dialogTitleId = useId();
  const dialogDescId = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(alreadyEnrolled);

  async function confirmEnroll() {
    setBusy(true);
    setError("");
    const result = await enrollInTraining(trainingId);
    setBusy(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setDone(true);
    setOpen(false);
    router.push("/pelatihan/saya");
    router.refresh();
  }

  if (done) {
    return (
      <p className="text-foreground text-sm font-medium" role="status">
        Anda sudah terdaftar pada pelatihan ini.
      </p>
    );
  }

  if (seatsLeft <= 0) {
    return (
      <p className="text-muted-foreground text-sm" role="status">
        Kuota pelatihan sudah penuh.
      </p>
    );
  }

  return (
    <div id="ikut-pelatihan" className="scroll-mt-24">
      <button
        type="button"
        className={cn(buttonVariants({ size: "lg" }), "min-h-11 px-4")}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        Ikut pelatihan
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="presentation"
          onClick={() => {
            if (!busy) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescId}
            className="border-border bg-background w-full max-w-md rounded-xl border p-5 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id={dialogTitleId}
              className="text-foreground text-lg font-semibold"
            >
              Konfirmasi pendaftaran
            </h2>
            <p
              id={dialogDescId}
              className="text-muted-foreground mt-2 text-sm leading-6"
            >
              Daftarkan diri ke{" "}
              <span className="text-foreground font-medium">
                {trainingTitle}
              </span>
              ? Ini masih simulasi tiruan — belum tersimpan ke server.
            </p>
            {error ? (
              <p className="text-destructive mt-3 text-sm" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-11 px-4",
                )}
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className={cn(buttonVariants({ size: "lg" }), "min-h-11 px-4")}
                disabled={busy}
                onClick={() => {
                  void confirmEnroll();
                }}
              >
                {busy ? "Mendaftarkan…" : "Ya, ikut pelatihan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
