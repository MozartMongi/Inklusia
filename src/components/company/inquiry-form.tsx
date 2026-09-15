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
  createCompanyInquiry,
  updateCompanyInquiry,
} from "@/lib/api/inquiries";
import {
  EMPTY_INQUIRY_FORM_VALUES,
  firstInquiryErrorField,
  INQUIRY_DISABILITY_OPTIONS,
  INQUIRY_JOB_TYPE_OPTIONS,
  inquiryToFormValues,
  validateInquiryForm,
  type InquiryFormErrors,
  type InquiryFormValues,
} from "@/lib/company/inquiry-form";
import type { CompanyInquiry } from "@/lib/types/inquiry";
import type { DisabilityFriendlyType, JobType } from "@/lib/types/job";
import { useId, useState, type FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type InquiryFormProps = {
  companyName: string;
  inquiry?: CompanyInquiry;
};

export function InquiryForm({ companyName, inquiry }: InquiryFormProps) {
  const formId = useId();
  const isEdit = Boolean(inquiry);
  const [values, setValues] = useState(
    inquiry ? inquiryToFormValues(inquiry) : EMPTY_INQUIRY_FORM_VALUES,
  );
  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  function update<K extends keyof InquiryFormValues>(
    field: K,
    value: InquiryFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateInquiryForm(values);
    setErrors(nextErrors);

    const firstField = firstInquiryErrorField(nextErrors);
    if (firstField) {
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    const input = {
      title: values.title.trim(),
      description: values.description.trim(),
      requirements: values.requirements.trim(),
      location: values.location.trim(),
      jobType: values.jobType as JobType,
      disabilityFriendlyType: values.disabilityFriendlyType as DisabilityFriendlyType,
      headcount: Number.parseInt(values.headcount, 10),
    };

    if (inquiry) {
      await updateCompanyInquiry(inquiry.id, input);
    } else {
      await createCompanyInquiry(input);
    }
    setStatus("saved");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <h2 id={`${formId}-heading`} className="text-xl font-semibold">
            Kebutuhan karyawan
          </h2>
        </CardTitle>
        <CardDescription>
          {isEdit
            ? `Perbarui kebutuhan ${companyName}. Perubahan masih simulasi sampai API perusahaan siap.`
            : `Inquiry ini untuk ${companyName}. Admin yang akan menyalurkan kandidat; jangan menerima lamaran langsung.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field id={`${formId}-title`} label="Nama posisi" error={errors.title}>
            <Input
              id={`${formId}-title`}
              name="title"
              required
              aria-required="true"
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? `${formId}-title-error` : undefined}
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              className="min-h-11"
            />
          </Field>

          <Field
            id={`${formId}-description`}
            label="Uraian kebutuhan"
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
              rows={4}
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              className={`${fieldClassName} py-2`}
            />
          </Field>

          <Field
            id={`${formId}-requirements`}
            label="Persyaratan"
            error={errors.requirements}
          >
            <textarea
              id={`${formId}-requirements`}
              name="requirements"
              required
              aria-required="true"
              aria-invalid={errors.requirements ? true : undefined}
              aria-describedby={
                errors.requirements ? `${formId}-requirements-error` : undefined
              }
              rows={4}
              value={values.requirements}
              onChange={(event) => update("requirements", event.target.value)}
              className={`${fieldClassName} py-2`}
            />
          </Field>

          <Field id={`${formId}-location`} label="Lokasi kerja" error={errors.location}>
            <Input
              id={`${formId}-location`}
              name="location"
              required
              aria-required="true"
              aria-invalid={errors.location ? true : undefined}
              aria-describedby={
                errors.location ? `${formId}-location-error` : undefined
              }
              value={values.location}
              onChange={(event) => update("location", event.target.value)}
              className="min-h-11"
            />
          </Field>

          <Field
            id={`${formId}-jobType`}
            label="Jenis pekerjaan"
            error={errors.jobType}
          >
            <select
              id={`${formId}-jobType`}
              name="jobType"
              required
              aria-required="true"
              aria-invalid={errors.jobType ? true : undefined}
              aria-describedby={
                errors.jobType ? `${formId}-jobType-error` : undefined
              }
              value={values.jobType}
              onChange={(event) =>
                update("jobType", event.target.value as JobType | "")
              }
              className={fieldClassName}
            >
              <option value="">Pilih jenis pekerjaan</option>
              {INQUIRY_JOB_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id={`${formId}-disabilityFriendlyType`}
            label="Disabilitas yang didukung"
            error={errors.disabilityFriendlyType}
          >
            <select
              id={`${formId}-disabilityFriendlyType`}
              name="disabilityFriendlyType"
              required
              aria-required="true"
              aria-invalid={errors.disabilityFriendlyType ? true : undefined}
              aria-describedby={
                errors.disabilityFriendlyType
                  ? `${formId}-disabilityFriendlyType-error`
                  : undefined
              }
              value={values.disabilityFriendlyType}
              onChange={(event) =>
                update(
                  "disabilityFriendlyType",
                  event.target.value as DisabilityFriendlyType | "",
                )
              }
              className={fieldClassName}
            >
              <option value="">Pilih jenis disabilitas yang didukung</option>
              {INQUIRY_DISABILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id={`${formId}-headcount`}
            label="Jumlah karyawan"
            error={errors.headcount}
          >
            <Input
              id={`${formId}-headcount`}
              name="headcount"
              type="number"
              inputMode="numeric"
              min={1}
              max={99}
              required
              aria-required="true"
              aria-invalid={errors.headcount ? true : undefined}
              aria-describedby={
                errors.headcount ? `${formId}-headcount-error` : undefined
              }
              value={values.headcount}
              onChange={(event) => update("headcount", event.target.value)}
              className="min-h-11"
            />
          </Field>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 px-4",
              })}
            >
              {isEdit ? "Simpan perubahan" : "Kirim inquiry"}
            </button>
            <p role="status" aria-live="polite" className="text-foreground text-sm">
              {status === "saved"
                ? isEdit
                  ? "Inquiry diperbarui (simulasi, belum ke server)."
                  : "Inquiry tersimpan (simulasi, belum ke server)."
                : ""}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm">
        {label}{" "}
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
        <span className="sr-only"> (wajib)</span>
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
