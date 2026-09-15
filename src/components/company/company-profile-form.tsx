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
import { saveCompanyProfile } from "@/lib/api/company";
import {
  firstCompanyProfileErrorField,
  validateCompanyProfileForm,
  type CompanyProfileFormErrors,
  type CompanyProfileFormValues,
} from "@/lib/company/profile-form";
import type { CompanyProfile } from "@/lib/types/company";
import { useId, useState, type FormEvent } from "react";

type CompanyProfileFormProps = {
  profile: CompanyProfile;
};

export function CompanyProfileForm({ profile }: CompanyProfileFormProps) {
  const formId = useId();
  const [values, setValues] = useState<CompanyProfileFormValues>({
    name: profile.name,
    address: profile.address,
    industry: profile.industry,
    nib: profile.nib,
    contactName: profile.contactPerson.name,
    contactPosition: profile.contactPerson.position,
    contactPhone: profile.contactPerson.phone,
    contactEmail: profile.contactPerson.email,
  });
  const [errors, setErrors] = useState<CompanyProfileFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  function update<K extends keyof CompanyProfileFormValues>(
    field: K,
    value: CompanyProfileFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCompanyProfileForm(values);
    setErrors(nextErrors);

    const firstField = firstCompanyProfileErrorField(nextErrors);
    if (firstField) {
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    await saveCompanyProfile({
      name: values.name.trim(),
      address: values.address.trim(),
      industry: values.industry.trim(),
      nib: values.nib.replace(/\D/g, ""),
      contactPerson: {
        name: values.contactName.trim(),
        position: values.contactPosition.trim(),
        phone: values.contactPhone.trim(),
        email: values.contactEmail.trim(),
      },
    });
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
            Nama, alamat, industri, dan NIB yang tampil ke admin saat penyaluran.
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
          <Field id={`${formId}-industry`} label="Industri" error={errors.industry}>
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
          <Field id={`${formId}-nib`} label="NIB" error={errors.nib}>
            <Input
              id={`${formId}-nib`}
              name="nib"
              inputMode="numeric"
              required
              aria-required="true"
              aria-invalid={errors.nib ? true : undefined}
              aria-describedby={errors.nib ? `${formId}-nib-error` : undefined}
              value={values.nib}
              onChange={(event) => update("nib", event.target.value)}
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
            Orang yang dihubungi admin saat menyalurkan kandidat.
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className={buttonVariants({
            size: "lg",
            className: "min-h-11 px-4",
          })}
        >
          Simpan profil perusahaan
        </button>
        <p role="status" aria-live="polite" className="text-foreground text-sm">
          {status === "saved"
            ? "Perubahan disimpan (simulasi, belum ke server)."
            : ""}
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
