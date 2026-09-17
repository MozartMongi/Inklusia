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
import { saveJobSeekerIdentity } from "@/lib/api/job-seeker";
import {
  IDENTITY_DISABILITY_OPTIONS,
  firstIdentityErrorField,
  validateIdentityForm,
  type IdentityFormErrors,
  type IdentityFormValues,
} from "@/lib/profile/identity";
import type {
  JobSeekerDisabilityType,
  JobSeekerProfile,
} from "@/lib/types/job-seeker";
import { useId, useState, type FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type IdentityFormProps = {
  profile: JobSeekerProfile;
};

export function IdentityForm({ profile }: IdentityFormProps) {
  const formId = useId();
  const [values, setValues] = useState<IdentityFormValues>({
    fullName: profile.fullName,
    phone: profile.phone,
    address: profile.address,
    disabilityType: profile.disabilityType,
    bio: profile.bio,
  });
  const [errors, setErrors] = useState<IdentityFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  function update<K extends keyof IdentityFormValues>(
    field: K,
    value: IdentityFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateIdentityForm(values);
    setErrors(nextErrors);

    const firstField = firstIdentityErrorField(nextErrors);
    if (firstField) {
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    const result = await saveJobSeekerIdentity({
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      disabilityType: values.disabilityType as JobSeekerDisabilityType,
      bio: values.bio.trim(),
    });
    if ("error" in result) {
      setErrors({ fullName: result.error });
      return;
    }
    setStatus("saved");
  }

  return (
    <section id="data-diri" className="scroll-mt-24" aria-labelledby="data-diri-heading">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 id="data-diri-heading" className="text-xl font-semibold">
              Data diri dan disabilitas
            </h2>
          </CardTitle>
          <CardDescription>
            Lengkapi identitas wajib agar admin dapat meninjau dan menyalurkan
            profil Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Email akun: {profile.email} (tidak dapat diubah di sini)
            </p>

            <Field
              id={`${formId}-fullName`}
              label="Nama lengkap"
              error={errors.fullName}
            >
              <Input
                id={`${formId}-fullName`}
                name="fullName"
                autoComplete="name"
                required
                aria-required="true"
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={
                  errors.fullName ? `${formId}-fullName-error` : undefined
                }
                value={values.fullName}
                onChange={(event) => update("fullName", event.target.value)}
                className="min-h-11"
              />
            </Field>

            <Field
              id={`${formId}-phone`}
              label="Nomor telepon"
              error={errors.phone}
            >
              <Input
                id={`${formId}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                aria-required="true"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={
                  errors.phone ? `${formId}-phone-error` : undefined
                }
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
                className="min-h-11"
              />
            </Field>

            <Field
              id={`${formId}-address`}
              label="Alamat"
              error={errors.address}
            >
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
              id={`${formId}-disabilityType`}
              label="Jenis disabilitas"
              error={errors.disabilityType}
            >
              <select
                id={`${formId}-disabilityType`}
                name="disabilityType"
                required
                aria-required="true"
                aria-invalid={errors.disabilityType ? true : undefined}
                aria-describedby={
                  errors.disabilityType
                    ? `${formId}-disabilityType-error`
                    : undefined
                }
                value={values.disabilityType}
                onChange={(event) =>
                  update(
                    "disabilityType",
                    event.target.value as JobSeekerDisabilityType | "",
                  )
                }
                className={fieldClassName}
              >
                <option value="">Pilih jenis disabilitas</option>
                {IDENTITY_DISABILITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field id={`${formId}-bio`} label="Tentang saya" error={errors.bio}>
              <textarea
                id={`${formId}-bio`}
                name="bio"
                required
                aria-required="true"
                aria-invalid={errors.bio ? true : undefined}
                aria-describedby={errors.bio ? `${formId}-bio-error` : undefined}
                rows={4}
                value={values.bio}
                onChange={(event) => update("bio", event.target.value)}
                className={`${fieldClassName} py-2`}
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
                Simpan data diri
              </button>
              <p
                role="status"
                aria-live="polite"
                className="text-foreground text-sm"
              >
                {status === "saved"
                  ? "Perubahan data diri disimpan."
                  : ""}
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
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
