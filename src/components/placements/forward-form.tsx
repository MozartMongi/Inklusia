"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createPlacement } from "@/lib/api/placements";
import {
  validateForwardForm,
  type ForwardFormErrors,
  type ForwardFormValues,
} from "@/lib/placements/forward";
import type { JobListing } from "@/lib/types/job";
import type { JobSeekerSummary, Placement } from "@/lib/types/placement";
import { useId, useState, type FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type ForwardFormProps = {
  seeker: JobSeekerSummary | null;
  jobs: JobListing[];
};

export function ForwardForm({ seeker, jobs }: ForwardFormProps) {
  const formId = useId();
  const [values, setValues] = useState<ForwardFormValues>({
    jobId: "",
    note: "",
  });
  const [errors, setErrors] = useState<ForwardFormErrors>({});
  const [step, setStep] = useState<"form" | "confirm" | "saved">("form");
  const [saved, setSaved] = useState<Placement | null>(null);

  const selectedJob = jobs.find((job) => job.id === values.jobId) ?? null;

  function update<K extends keyof ForwardFormValues>(
    field: K,
    value: ForwardFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStep("form");
    setSaved(null);
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!seeker) {
      return;
    }

    const nextErrors = validateForwardForm(values);
    setErrors(nextErrors);

    if (nextErrors.jobId) {
      document.getElementById(`${formId}-jobId`)?.focus();
      return;
    }
    if (nextErrors.note) {
      document.getElementById(`${formId}-note`)?.focus();
      return;
    }

    setStep("confirm");
  }

  async function handleConfirm() {
    if (!seeker || !selectedJob) {
      return;
    }

    const result = await createPlacement({
      jobSeekerId: seeker.id,
      jobId: selectedJob.id,
      note: values.note.trim(),
    });
    setSaved(result.data);
    setStep("saved");
  }

  return (
    <section id="salurkan" className="scroll-mt-24" aria-labelledby="salurkan-heading">
      <Card>
        <CardHeader>
          <CardTitle id="salurkan-heading" className="text-xl font-semibold">
            Salurkan kandidat
          </CardTitle>
          <CardDescription>
            Kirim profil pencari kerja terpilih ke perusahaan. Penyaluran ini
            masih simulasi sampai API admin siap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!seeker ? (
            <p className="text-muted-foreground text-sm">
              Pilih pencari kerja di daftar atas sebelum mengisi formulir
              penyaluran.
            </p>
          ) : step === "saved" && saved ? (
            <p role="status" className="text-foreground text-sm leading-6">
              {saved.jobSeeker.fullName} sudah disalurkan ke{" "}
              {saved.job.title} di {saved.job.companyName}. Status: sudah
              dikirim ke perusahaan.
            </p>
          ) : step === "confirm" && selectedJob ? (
            <div className="flex flex-col gap-4">
              <p className="text-foreground text-sm leading-6">
                Konfirmasi penyaluran{" "}
                <span className="font-medium">{seeker.fullName}</span> ke
                lowongan{" "}
                <span className="font-medium">{selectedJob.title}</span> di{" "}
                {selectedJob.company.name}?
              </p>
              {values.note.trim() ? (
                <p className="text-muted-foreground text-sm leading-6">
                  Catatan: {values.note.trim()}
                </p>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={buttonVariants({
                    size: "lg",
                    className: "min-h-11 w-full px-4 sm:w-auto",
                  })}
                >
                  Ya, salurkan sekarang
                </button>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "min-h-11 w-full px-4 sm:w-auto",
                  })}
                >
                  Kembali ke formulir
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReview} className="flex flex-col gap-4" noValidate>
              <p className="text-foreground text-sm">
                Kandidat terpilih:{" "}
                <span className="font-medium">{seeker.fullName}</span>
              </p>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${formId}-jobId`}>Lowongan tujuan (wajib)</Label>
                <select
                  id={`${formId}-jobId`}
                  name="jobId"
                  required
                  value={values.jobId}
                  onChange={(event) => update("jobId", event.target.value)}
                  aria-invalid={Boolean(errors.jobId)}
                  aria-describedby={errors.jobId ? `${formId}-jobId-error` : undefined}
                  className={fieldClassName}
                >
                  <option value="">Pilih lowongan</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.company.name}
                    </option>
                  ))}
                </select>
                {errors.jobId ? (
                  <p
                    id={`${formId}-jobId-error`}
                    role="alert"
                    className="text-destructive text-sm"
                  >
                    {errors.jobId}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${formId}-note`}>Catatan untuk perusahaan</Label>
                <textarea
                  id={`${formId}-note`}
                  name="note"
                  rows={4}
                  value={values.note}
                  onChange={(event) => update("note", event.target.value)}
                  aria-invalid={Boolean(errors.note)}
                  aria-describedby={errors.note ? `${formId}-note-error` : undefined}
                  className={`${fieldClassName} min-h-28 py-2`}
                  placeholder="Opsional. Contoh: kandidat nyaman bekerja lewat teks."
                />
                {errors.note ? (
                  <p
                    id={`${formId}-note-error`}
                    role="alert"
                    className="text-destructive text-sm"
                  >
                    {errors.note}
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                className={buttonVariants({
                  size: "lg",
                  className: "min-h-11 w-full px-4 sm:w-auto",
                })}
              >
                Tinjau penyaluran
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
