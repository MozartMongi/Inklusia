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
import { registerCompany } from "@/lib/api/auth";
import {
  EMPTY_REGISTER_COMPANY_VALUES,
  firstRegisterCompanyErrorField,
  validateRegisterCompanyForm,
  type RegisterCompanyFormErrors,
  type RegisterCompanyFormValues,
  type YesNoAnswer,
} from "@/lib/auth/register-company";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

export function CompanyRegisterForm() {
  const formId = useId();
  const [values, setValues] = useState<RegisterCompanyFormValues>(
    EMPTY_REGISTER_COMPANY_VALUES,
  );
  const [errors, setErrors] = useState<RegisterCompanyFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  function update<K extends keyof RegisterCompanyFormValues>(
    field: K,
    value: RegisterCompanyFormValues[K],
  ) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === "hasDisabilityEmployees" && value === "ya") {
        next.disabilityHirePlan = "";
      }
      return next;
    });
    setStatus("idle");
    setErrors((current) => {
      const next = { ...current, [field]: undefined };
      if (field === "hasDisabilityEmployees" && value === "ya") {
        next.disabilityHirePlan = undefined;
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegisterCompanyForm(values);
    setErrors(nextErrors);

    const firstField = firstRegisterCompanyErrorField(nextErrors);
    if (firstField) {
      const focusId =
        firstField === "hasDisabilityEmployees" ||
        firstField === "hasCsrOrGrant"
          ? `${formId}-${firstField}-ya`
          : `${formId}-${firstField}`;
      document.getElementById(focusId)?.focus();
      return;
    }

    const result = await registerCompany({
      name: values.name.trim(),
      address: values.address.trim(),
      industry: values.industry.trim(),
      contactName: values.contactName.trim(),
      contactPosition: values.contactPosition.trim(),
      contactPhone: values.contactPhone.trim(),
      contactEmail: values.contactEmail.trim(),
      password: values.password,
      hasDisabilityEmployees: values.hasDisabilityEmployees as YesNoAnswer,
      disabilityWorkersNeeded: Number(values.disabilityWorkersNeeded),
      neededSkills: values.neededSkills.trim(),
      disabilityHirePlan:
        values.hasDisabilityEmployees === "tidak"
          ? values.disabilityHirePlan.trim()
          : null,
      hasCsrOrGrant: values.hasCsrOrGrant as YesNoAnswer,
    });
    if ("error" in result) {
      setErrors((current) => ({
        ...current,
        contactEmail: result.errors?.contactEmail ?? result.error,
      }));
      document.getElementById(`${formId}-contactEmail`)?.focus();
      return;
    }
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 id={`${formId}-company-heading`} className="text-xl font-semibold">
              Data perusahaan
            </h2>
          </CardTitle>
          <CardDescription>
            Nama, alamat, dan industri yang dipakai admin saat meninjau
            perusahaan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field id={`${formId}-name`} label="Nama perusahaan" error={errors.name}>
            <Input
              id={`${formId}-name`}
              name="name"
              autoComplete="organization"
              required
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${formId}-name-error` : undefined}
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              className="min-h-11"
            />
          </Field>
          <Field id={`${formId}-address`} label="Alamat" error={errors.address}>
            <Input
              id={`${formId}-address`}
              name="address"
              autoComplete="street-address"
              required
              aria-required="true"
              aria-invalid={errors.address ? true : undefined}
              aria-describedby={
                errors.address ? `${formId}-address-error` : undefined
              }
              value={values.address}
              onChange={(event) => update("address", event.target.value)}
              className="min-h-11"
            />
          </Field>
          <Field
            id={`${formId}-industry`}
            label="Industri"
            error={errors.industry}
          >
            <Input
              id={`${formId}-industry`}
              name="industry"
              required
              aria-required="true"
              aria-invalid={errors.industry ? true : undefined}
              aria-describedby={
                errors.industry ? `${formId}-industry-error` : undefined
              }
              value={values.industry}
              onChange={(event) => update("industry", event.target.value)}
              className="min-h-11"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 id={`${formId}-contact-heading`} className="text-xl font-semibold">
              Kontak person
            </h2>
          </CardTitle>
          <CardDescription>
            Email kontak person sekaligus dipakai untuk masuk ke ruang
            perusahaan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field
            id={`${formId}-contactName`}
            label="Nama kontak person"
            error={errors.contactName}
          >
            <Input
              id={`${formId}-contactName`}
              name="contactName"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={errors.contactName ? true : undefined}
              aria-describedby={
                errors.contactName ? `${formId}-contactName-error` : undefined
              }
              value={values.contactName}
              onChange={(event) => update("contactName", event.target.value)}
              className="min-h-11"
            />
          </Field>
          <Field
            id={`${formId}-contactPosition`}
            label="Jabatan"
            error={errors.contactPosition}
          >
            <Input
              id={`${formId}-contactPosition`}
              name="contactPosition"
              autoComplete="organization-title"
              required
              aria-required="true"
              aria-invalid={errors.contactPosition ? true : undefined}
              aria-describedby={
                errors.contactPosition
                  ? `${formId}-contactPosition-error`
                  : undefined
              }
              value={values.contactPosition}
              onChange={(event) => update("contactPosition", event.target.value)}
              className="min-h-11"
            />
          </Field>
          <Field
            id={`${formId}-contactPhone`}
            label="Nomor telepon"
            error={errors.contactPhone}
          >
            <Input
              id={`${formId}-contactPhone`}
              name="contactPhone"
              type="tel"
              autoComplete="tel"
              required
              aria-required="true"
              aria-invalid={errors.contactPhone ? true : undefined}
              aria-describedby={
                errors.contactPhone ? `${formId}-contactPhone-error` : undefined
              }
              value={values.contactPhone}
              onChange={(event) => update("contactPhone", event.target.value)}
              className="min-h-11"
            />
          </Field>
          <Field
            id={`${formId}-contactEmail`}
            label="Email"
            error={errors.contactEmail}
          >
            <Input
              id={`${formId}-contactEmail`}
              name="contactEmail"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={errors.contactEmail ? true : undefined}
              aria-describedby={
                errors.contactEmail ? `${formId}-contactEmail-error` : undefined
              }
              value={values.contactEmail}
              onChange={(event) => update("contactEmail", event.target.value)}
              className="min-h-11"
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2
              id={`${formId}-inclusion-heading`}
              className="text-xl font-semibold"
            >
              Kesiapan inklusi
            </h2>
          </CardTitle>
          <CardDescription>
            Jawaban ini membantu admin memahami kebutuhan dan kesiapan
            perusahaan terhadap pekerja disabilitas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <YesNoField
            id={`${formId}-hasDisabilityEmployees`}
            name="hasDisabilityEmployees"
            label="Apakah perusahaan Anda memiliki karyawan disabilitas?"
            value={values.hasDisabilityEmployees}
            error={errors.hasDisabilityEmployees}
            onChange={(value) => update("hasDisabilityEmployees", value)}
          />
          <Field
            id={`${formId}-disabilityWorkersNeeded`}
            label="Berapa banyak pekerja disabilitas yang dibutuhkan di perusahaan Anda?"
            error={errors.disabilityWorkersNeeded}
          >
            <Input
              id={`${formId}-disabilityWorkersNeeded`}
              name="disabilityWorkersNeeded"
              type="number"
              inputMode="numeric"
              min={1}
              max={10000}
              required
              aria-required="true"
              aria-invalid={errors.disabilityWorkersNeeded ? true : undefined}
              aria-describedby={
                errors.disabilityWorkersNeeded
                  ? `${formId}-disabilityWorkersNeeded-error`
                  : undefined
              }
              value={values.disabilityWorkersNeeded}
              onChange={(event) =>
                update("disabilityWorkersNeeded", event.target.value)
              }
              className="min-h-11"
            />
          </Field>
          <Field
            id={`${formId}-neededSkills`}
            label="Keahlian apa yang dibutuhkan perusahaan Anda untuk pekerja disabilitas?"
            error={errors.neededSkills}
          >
            <textarea
              id={`${formId}-neededSkills`}
              name="neededSkills"
              rows={3}
              required
              aria-required="true"
              aria-invalid={errors.neededSkills ? true : undefined}
              aria-describedby={
                errors.neededSkills
                  ? `${formId}-neededSkills-error`
                  : undefined
              }
              value={values.neededSkills}
              onChange={(event) => update("neededSkills", event.target.value)}
              className={`${fieldClassName} py-2`}
              placeholder="Contoh: layanan pelanggan tertulis, entri data, administrasi kantor"
            />
          </Field>
          {values.hasDisabilityEmployees === "tidak" ? (
            <Field
              id={`${formId}-disabilityHirePlan`}
              label="Jika perusahaan Anda belum memiliki pekerja disabilitas, maka kapan rencana perusahaan akan menerapkan pekerja disabilitas?"
              error={errors.disabilityHirePlan}
            >
              <textarea
                id={`${formId}-disabilityHirePlan`}
                name="disabilityHirePlan"
                rows={3}
                required
                aria-required="true"
                aria-invalid={errors.disabilityHirePlan ? true : undefined}
                aria-describedby={
                  errors.disabilityHirePlan
                    ? `${formId}-disabilityHirePlan-error`
                    : undefined
                }
                value={values.disabilityHirePlan}
                onChange={(event) =>
                  update("disabilityHirePlan", event.target.value)
                }
                className={`${fieldClassName} py-2`}
                placeholder="Contoh: semester depan, setelah pelatihan internal selesai, atau Q3 2026"
              />
            </Field>
          ) : null}
          <YesNoField
            id={`${formId}-hasCsrOrGrant`}
            name="hasCsrOrGrant"
            label="Apakah perusahaan Anda memiliki program CSR atau dana hibah untuk program pelatihan khusus penyandang disabilitas di Indonesia?"
            value={values.hasCsrOrGrant}
            error={errors.hasCsrOrGrant}
            onChange={(value) => update("hasCsrOrGrant", value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2
              id={`${formId}-credentials-heading`}
              className="text-xl font-semibold"
            >
              Kredensial masuk
            </h2>
          </CardTitle>
          <CardDescription>
            Kata sandi dipakai bersama email kontak person untuk masuk.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field
            id={`${formId}-password`}
            label="Kata sandi"
            error={errors.password}
          >
            <Input
              id={`${formId}-password`}
              name="password"
              type="password"
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={
                errors.password ? `${formId}-password-error` : undefined
              }
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
              className="min-h-11"
            />
          </Field>
          <Field
            id={`${formId}-passwordConfirm`}
            label="Ulangi kata sandi"
            error={errors.passwordConfirm}
          >
            <Input
              id={`${formId}-passwordConfirm`}
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={errors.passwordConfirm ? true : undefined}
              aria-describedby={
                errors.passwordConfirm
                  ? `${formId}-passwordConfirm-error`
                  : undefined
              }
              value={values.passwordConfirm}
              onChange={(event) =>
                update("passwordConfirm", event.target.value)
              }
              className="min-h-11"
            />
          </Field>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className={buttonVariants({
            size: "lg",
            className: "min-h-11 px-4",
          })}
        >
          Daftar sebagai perusahaan
        </button>
        <p role="status" aria-live="polite" className="text-foreground text-sm">
          {status === "saved" ? (
            <>
              Pendaftaran berhasil.{" "}
              <Link
                href="/masuk"
                className="text-primary font-medium underline underline-offset-4"
              >
                Lanjut ke halaman masuk
              </Link>
            </>
          ) : (
            ""
          )}
        </p>
      </div>
    </form>
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

function YesNoField({
  id,
  name,
  label,
  value,
  error,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  value: YesNoAnswer | "";
  error?: string;
  onChange: (value: YesNoAnswer | "") => void;
}) {
  return (
    <fieldset
      className="flex flex-col gap-2"
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="text-sm font-medium">
        {label}{" "}
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
        <span className="sr-only"> (wajib)</span>
      </legend>
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            id={`${id}-ya`}
            type="radio"
            name={name}
            value="ya"
            checked={value === "ya"}
            onChange={() => onChange("ya")}
            className="size-4"
            required
          />
          Ya
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            id={`${id}-tidak`}
            type="radio"
            name={name}
            value="tidak"
            checked={value === "tidak"}
            onChange={() => onChange("tidak")}
            className="size-4"
          />
          Tidak
        </label>
      </div>
      {/* Target id for programmatic focus when validation fails */}
      <span id={id} className="sr-only" tabIndex={-1} />
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
