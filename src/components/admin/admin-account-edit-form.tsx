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
  setAdminAccountStatus,
  updateAdminAccount,
} from "@/lib/api/admin";
import {
  firstAdminAccountFormErrorField,
  validateAdminAccountEditForm,
  type AdminAccountFormErrors,
  type AdminAccountEditFormValues,
} from "@/lib/admin/admin-account-form";
import {
  ADMIN_ACCOUNT_KIND_LABEL,
  ADMIN_ACCOUNT_STATUS_LABEL,
  type AdminAccount,
} from "@/lib/types/admin-account";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

type AdminAccountEditFormProps = {
  account: AdminAccount;
};

export function AdminAccountEditForm({ account }: AdminAccountEditFormProps) {
  const formId = useId();
  const router = useRouter();
  const [values, setValues] = useState<AdminAccountEditFormValues>({
    fullName: account.fullName,
    email: account.email,
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState(account.status);
  const [errors, setErrors] = useState<AdminAccountFormErrors>({});
  const [formError, setFormError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isRoot = account.kind === "root";

  function update<K extends keyof AdminAccountEditFormValues>(
    field: K,
    value: AdminAccountEditFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError("");
    setStatusMessage("");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateAdminAccountEditForm(values);
    setErrors(nextErrors);

    const firstField = firstAdminAccountFormErrorField(nextErrors);
    if (firstField) {
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    setBusy(true);
    const result = await updateAdminAccount(account.id, {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password || undefined,
    });
    setBusy(false);

    if (!result) {
      setFormError("Akun admin tidak ditemukan.");
      return;
    }
    if ("error" in result) {
      setFormError(result.error);
      return;
    }

    setValues((current) => ({
      ...current,
      password: "",
      confirmPassword: "",
    }));
    setStatusMessage(
      values.password
        ? "Perubahan dan kata sandi baru disimpan."
        : "Perubahan disimpan.",
    );
    router.refresh();
  }

  async function handleToggleStatus() {
    const nextStatus = status === "aktif" ? "nonaktif" : "aktif";
    setBusy(true);
    const result = await setAdminAccountStatus(account.id, nextStatus);
    setBusy(false);

    if (!result) {
      setFormError("Akun admin tidak ditemukan.");
      return;
    }
    if ("error" in result) {
      setFormError(result.error);
      return;
    }

    setStatus(result.data.status);
    setStatusMessage(
      result.data.status === "nonaktif"
        ? "Akun dinonaktifkan."
        : "Akun diaktifkan kembali.",
    );
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 className="text-xl font-semibold">Ubah akun admin</h2>
            </CardTitle>
            <CardDescription>
              {ADMIN_ACCOUNT_KIND_LABEL[account.kind]} · status saat ini{" "}
              {ADMIN_ACCOUNT_STATUS_LABEL[status]}.
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
                readOnly={isRoot}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={
                  errors.email
                    ? `${formId}-email-error`
                    : isRoot
                      ? `${formId}-email-hint`
                      : undefined
                }
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                className="min-h-11"
              />
              {isRoot && !errors.email ? (
                <p
                  id={`${formId}-email-hint`}
                  className="text-muted-foreground text-sm"
                >
                  Email root admin tidak dapat diubah.
                </p>
              ) : null}
            </Field>
            <Field
              id={`${formId}-password`}
              label="Kata sandi baru (opsional)"
              error={errors.password}
              required={false}
            >
              <Input
                id={`${formId}-password`}
                name="password"
                type="password"
                autoComplete="new-password"
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
                  Kosongkan jika tidak ingin mengganti kata sandi.
                </p>
              ) : null}
            </Field>
            <Field
              id={`${formId}-confirmPassword`}
              label="Konfirmasi kata sandi baru"
              error={errors.confirmPassword}
              required={false}
            >
              <Input
                id={`${formId}-confirmPassword`}
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
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
            {busy ? "Menyimpan…" : "Simpan perubahan"}
          </button>
          <p
            role="status"
            aria-live="polite"
            className="text-foreground text-sm"
          >
            {statusMessage}
          </p>
        </div>
      </form>

      {!isRoot ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 className="text-xl font-semibold">Status akun</h2>
            </CardTitle>
            <CardDescription>
              Nonaktifkan akun agar tidak dapat masuk ke dashboard. Akun root
              tidak dapat dinonaktifkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              disabled={busy}
              onClick={handleToggleStatus}
              className={buttonVariants({
                variant: status === "aktif" ? "destructive" : "default",
                size: "lg",
                className: "min-h-11 px-4",
              })}
            >
              {status === "aktif" ? "Nonaktifkan akun" : "Aktifkan akun"}
            </button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
  required = true,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required ? (
          <>
            {" "}
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
            <span className="sr-only"> (wajib)</span>
          </>
        ) : null}
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
