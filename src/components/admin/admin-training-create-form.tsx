"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ADMIN_TRAINING_FORMAT_OPTIONS,
  EMPTY_ADMIN_TRAINING_FORM,
  adminTrainingFormToPayload,
  firstAdminTrainingFormErrorField,
  validateAdminTrainingForm,
  type AdminTrainingFormErrors,
  type AdminTrainingFormValues,
} from "@/lib/admin/admin-training-form";
import { createAdminTraining } from "@/lib/api/admin";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

export function AdminTrainingCreateForm() {
  const formId = useId();
  const router = useRouter();
  const [values, setValues] = useState<AdminTrainingFormValues>(
    EMPTY_ADMIN_TRAINING_FORM,
  );
  const [errors, setErrors] = useState<AdminTrainingFormErrors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  function update<K extends keyof AdminTrainingFormValues>(
    field: K,
    value: AdminTrainingFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError("");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAdminTrainingForm(values);
    setErrors(nextErrors);

    const firstField = firstAdminTrainingFormErrorField(nextErrors);
    if (firstField) {
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    setBusy(true);
    const result = await createAdminTraining(adminTrainingFormToPayload(values));
    setBusy(false);

    if ("error" in result) {
      if (result.errors) {
        setErrors((current) => ({ ...current, ...result.errors }));
      }
      setFormError(result.error);
      document.getElementById(`${formId}-title`)?.focus();
      return;
    }

    router.push(`/admin/pelatihan/${result.data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 className="text-xl font-semibold">Data pelatihan</h2>
          </CardTitle>
          <CardDescription>
            Pelatihan yang dipublikasikan akan tampil di katalog publik
            `/pelatihan` dan dapat diikuti pencari kerja.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field id={`${formId}-title`} label="Judul" error={errors.title}>
            <Input
              id={`${formId}-title`}
              name="title"
              required
              aria-required="true"
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={
                errors.title ? `${formId}-title-error` : undefined
              }
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              className="min-h-11"
            />
          </Field>

          <Field
            id={`${formId}-summary`}
            label="Ringkasan singkat"
            error={errors.summary}
          >
            <Input
              id={`${formId}-summary`}
              name="summary"
              required
              aria-required="true"
              aria-invalid={errors.summary ? true : undefined}
              aria-describedby={
                errors.summary ? `${formId}-summary-error` : undefined
              }
              value={values.summary}
              onChange={(event) => update("summary", event.target.value)}
              className="min-h-11"
            />
          </Field>

          <Field
            id={`${formId}-description`}
            label="Deskripsi lengkap"
            error={errors.description}
          >
            <textarea
              id={`${formId}-description`}
              name="description"
              required
              aria-required="true"
              aria-invalid={errors.description ? true : undefined}
              aria-describedby={
                errors.description ? `${formId}-description-error` : undefined
              }
              rows={5}
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              className={`${fieldClassName} py-2`}
            />
          </Field>

          <Field
            id={`${formId}-provider`}
            label="Penyelenggara"
            error={errors.provider}
          >
            <Input
              id={`${formId}-provider`}
              name="provider"
              required
              aria-required="true"
              aria-invalid={errors.provider ? true : undefined}
              aria-describedby={
                errors.provider ? `${formId}-provider-error` : undefined
              }
              value={values.provider}
              onChange={(event) => update("provider", event.target.value)}
              className="min-h-11"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id={`${formId}-format`}
              label="Format"
              error={errors.format}
            >
              <select
                id={`${formId}-format`}
                name="format"
                required
                aria-required="true"
                aria-invalid={errors.format ? true : undefined}
                aria-describedby={
                  errors.format ? `${formId}-format-error` : undefined
                }
                value={values.format}
                onChange={(event) =>
                  update(
                    "format",
                    event.target.value as AdminTrainingFormValues["format"],
                  )
                }
                className={fieldClassName}
              >
                <option value="">Pilih format</option>
                {ADMIN_TRAINING_FORMAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id={`${formId}-durationLabel`}
              label="Durasi"
              error={errors.durationLabel}
            >
              <Input
                id={`${formId}-durationLabel`}
                name="durationLabel"
                placeholder="Contoh: 4 pertemuan · 2 minggu"
                required
                aria-required="true"
                aria-invalid={errors.durationLabel ? true : undefined}
                aria-describedby={
                  errors.durationLabel
                    ? `${formId}-durationLabel-error`
                    : undefined
                }
                value={values.durationLabel}
                onChange={(event) =>
                  update("durationLabel", event.target.value)
                }
                className="min-h-11"
              />
            </Field>
          </div>

          <Field
            id={`${formId}-skillTags`}
            label="Tag keahlian"
            error={errors.skillTags}
            hint="Pisahkan dengan koma, misalnya: Spreadsheet, Entri data"
          >
            <Input
              id={`${formId}-skillTags`}
              name="skillTags"
              aria-invalid={errors.skillTags ? true : undefined}
              aria-describedby={
                errors.skillTags
                  ? `${formId}-skillTags-error`
                  : `${formId}-skillTags-hint`
              }
              value={values.skillTags}
              onChange={(event) => update("skillTags", event.target.value)}
              className="min-h-11"
            />
          </Field>

          <Field
            id={`${formId}-accessibilityNotes`}
            label="Catatan aksesibilitas"
            error={errors.accessibilityNotes}
          >
            <textarea
              id={`${formId}-accessibilityNotes`}
              name="accessibilityNotes"
              required
              aria-required="true"
              aria-invalid={errors.accessibilityNotes ? true : undefined}
              aria-describedby={
                errors.accessibilityNotes
                  ? `${formId}-accessibilityNotes-error`
                  : undefined
              }
              rows={3}
              value={values.accessibilityNotes}
              onChange={(event) =>
                update("accessibilityNotes", event.target.value)
              }
              className={`${fieldClassName} py-2`}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id={`${formId}-startsAt`}
              label="Mulai"
              error={errors.startsAt}
            >
              <Input
                id={`${formId}-startsAt`}
                name="startsAt"
                type="datetime-local"
                required
                aria-required="true"
                aria-invalid={errors.startsAt ? true : undefined}
                aria-describedby={
                  errors.startsAt ? `${formId}-startsAt-error` : undefined
                }
                value={values.startsAt}
                onChange={(event) => update("startsAt", event.target.value)}
                className="min-h-11"
              />
            </Field>

            <Field
              id={`${formId}-endsAt`}
              label="Selesai"
              error={errors.endsAt}
            >
              <Input
                id={`${formId}-endsAt`}
                name="endsAt"
                type="datetime-local"
                required
                aria-required="true"
                aria-invalid={errors.endsAt ? true : undefined}
                aria-describedby={
                  errors.endsAt ? `${formId}-endsAt-error` : undefined
                }
                value={values.endsAt}
                onChange={(event) => update("endsAt", event.target.value)}
                className="min-h-11"
              />
            </Field>
          </div>

          <Field
            id={`${formId}-seatsTotal`}
            label="Kuota peserta"
            error={errors.seatsTotal}
          >
            <Input
              id={`${formId}-seatsTotal`}
              name="seatsTotal"
              type="number"
              min={1}
              step={1}
              required
              aria-required="true"
              aria-invalid={errors.seatsTotal ? true : undefined}
              aria-describedby={
                errors.seatsTotal ? `${formId}-seatsTotal-error` : undefined
              }
              value={values.seatsTotal}
              onChange={(event) => update("seatsTotal", event.target.value)}
              className="min-h-11"
            />
          </Field>

          <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <input
              id={`${formId}-isPublished`}
              name="isPublished"
              type="checkbox"
              checked={values.isPublished}
              onChange={(event) => update("isPublished", event.target.checked)}
              className="mt-1 size-4"
            />
            <div>
              <Label htmlFor={`${formId}-isPublished`} className="text-sm">
                Publikasikan ke katalog
              </Label>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                Jika dicentang, pelatihan langsung tampil di halaman pelatihan
                publik.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {formError ? (
        <p role="alert" className="text-destructive text-sm">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className={buttonVariants({ variant: "default" })}
        >
          {busy ? "Menyimpan…" : "Simpan pelatihan"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-muted-foreground text-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
