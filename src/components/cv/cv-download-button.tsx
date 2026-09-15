"use client";

import { buttonVariants } from "@/components/ui/button";
import { simulateCvDownload } from "@/lib/api/cv";
import type { GeneratedCv, SimulatedCvDownload } from "@/lib/types/cv";
import { useState } from "react";

type CvDownloadButtonProps = {
  cv: GeneratedCv;
};

export function CvDownloadButton({ cv }: CvDownloadButtonProps) {
  const [step, setStep] = useState<"idle" | "confirm" | "done">("idle");
  const [result, setResult] = useState<SimulatedCvDownload | null>(null);

  async function handleConfirm() {
    const download = await simulateCvDownload(cv);
    setResult(download);
    setStep("done");
  }

  return (
    <div className="mb-6">
      {step === "done" && result ? (
        <p role="status" className="text-foreground text-base leading-7">
          Simulasi unduh selesai. Berkas{" "}
          <span className="font-medium">{result.fileName}</span> siap
          (belum ada berkas sungguhan sampai API PDF tersedia).
        </p>
      ) : null}

      {step === "confirm" ? (
        <div className="flex flex-col gap-4">
          <p className="text-foreground text-base leading-7">
            Unduh CV {cv.fullName}? Ini simulasi — berkas PDF belum dibuat.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleConfirm}
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 w-full px-4 sm:w-auto",
              })}
            >
              Ya, unduh simulasi
            </button>
            <button
              type="button"
              onClick={() => setStep("idle")}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "min-h-11 w-full px-4 sm:w-auto",
              })}
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setStep("confirm")}
          className={buttonVariants({
            size: "lg",
            className: "min-h-11 w-full px-4 sm:w-auto",
          })}
        >
          Unduh CV
        </button>
      )}
    </div>
  );
}
