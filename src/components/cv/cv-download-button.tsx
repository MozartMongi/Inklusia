"use client";

import { buttonVariants } from "@/components/ui/button";
import { downloadGeneratedCv } from "@/lib/api/cv";
import { isApiError } from "@/lib/api/http";
import type { GeneratedCv } from "@/lib/types/cv";
import { useState } from "react";

type CvDownloadButtonProps = {
  cv: GeneratedCv;
};

export function CvDownloadButton({ cv }: CvDownloadButtonProps) {
  const [step, setStep] = useState<"idle" | "confirm" | "done" | "error">(
    "idle",
  );
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function handleConfirm() {
    try {
      const download = await downloadGeneratedCv();
      const url = URL.createObjectURL(download.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = download.fileName;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setFileName(download.fileName);
      setStep("done");
    } catch (caught) {
      setError(
        isApiError(caught)
          ? caught.message
          : "CV gagal diunduh. Coba lagi nanti.",
      );
      setStep("error");
    }
  }

  return (
    <div className="mb-6">
      {step === "done" ? (
        <p role="status" className="text-foreground text-base leading-7">
          Unduhan dimulai. Berkas{" "}
          <span className="font-medium">{fileName}</span> siap disimpan.
        </p>
      ) : null}
      {step === "error" ? (
        <p role="alert" className="text-destructive mb-3 text-sm">
          {error}
        </p>
      ) : null}

      {step === "confirm" ? (
        <div className="flex flex-col gap-4">
          <p className="text-foreground text-base leading-7">
            Unduh CV {cv.fullName} sebagai PDF?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleConfirm()}
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 w-full px-4 sm:w-auto",
              })}
            >
              Ya, unduh PDF
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
          onClick={() => {
            setError("");
            setStep("confirm");
          }}
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
