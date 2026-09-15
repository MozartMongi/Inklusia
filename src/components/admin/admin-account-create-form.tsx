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
import { createAdminAccount } from "@/lib/api/admin";
import {
  EMPTY_ADMIN_ACCOUNT_FORM,
  firstAdminAccountFormErrorField,
  validateAdminAccountCreateForm,
  type AdminAccountFormErrors,
  type AdminAccountFormValues,
} from "@/lib/admin/admin-account-form";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

export function AdminAccountCreateForm() {
  const formId = useId();
  const router = useRouter();
  const [values, setValues] = useState<AdminAccountFormValues>(
    EMPTY_ADMIN_ACCOUNT_FORM,
  );
  const [errors, setErrors] = useState<AdminAccountFormErrors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  function update<K extends keyof AdminAccountFormValues>(
    field: K,
    value: AdminAccountFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError("");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAdminAccountCreateForm(values);
    setErrors(nextErrors);

    const firstField = firstAdminAccountFormErrorField(nextErrors);
    if (firstField) {
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    setBusy(true);
    const result = await createAdminAccount({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password,
    });
    setBusy(false);

    if ("error" in result) {
      setFormError(result.error);
      document.getElementById(`${formId}-email`)?.focus();
      return;
    }

    router.push("/admin/akun");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 className="text-xl font-semibold">Data akun admin</h2>
          </CardTitle>
          <CardDescription>
            Akun baru berjenis admin biasa. Hanya root yang boleh menambahkan
            akun ini (simulasi frontend).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
          <Field id={`${formId}-email`} label="Email" error={errors.email}>
            <Input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={
                errors.email ? `${formId}-email-error` : undefined
              }
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              className="min-h-11"
            />
          </Field>
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
                errors.password
                  ? `${formId}-password-error`
                  : `${formId}-password-hint`
              }
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
              className="min-h-11"
            />
            {!errors.password ? (
              <p
                id={`${formId}-password-hint`}
                className="text-muted-foreground text-sm"
              >
                Minimal 8 karakter. Kata sandi tidak ditampilkan kembali setelah
                disimpan.
              </p>
            ) : null}
          </Field>
          <Field
            id={`${formId}-confirmPassword`}
            label="Konfirmasi kata sandi"
            error={errors.confirmPassword}
          >
            <Input
              id={`${formId}-confirmPassword`}
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={errors.confirmPassword ? true : undefined}
              aria-describedby={
                errors.confirmPassword
                  ? `${formId}-confirmPassword-error`
                  : undefined
              }
              value={values.confirmPassword}
              onChange={(event) =>
                update("confirmPassword", event.target.value)
              }
              className="min-h-11"
            />
          </Field>
          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className={buttonVariants({
            size: "lg",
            className: "min-h-11 px-4",
          })}
        >
          {busy ? "Menyimpan…" : "Tambah akun admin"}
        </button>
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
