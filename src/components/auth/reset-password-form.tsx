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
import { confirmPasswordReset } from "@/lib/api/auth";
import {
  EMPTY_RESET_PASSWORD_VALUES,
  firstResetPasswordErrorField,
  validateResetPasswordForm,
  type ResetPasswordFormErrors,
  type ResetPasswordFormValues,
} from "@/lib/auth/reset-password";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

type ResetPasswordFormProps = {
  token: string | null;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const formId = useId();
  const [values, setValues] = useState<ResetPasswordFormValues>(
    EMPTY_RESET_PASSWORD_VALUES,
  );
  const [errors, setErrors] = useState<ResetPasswordFormErrors>(() =>
    token?.trim()
      ? {}
      : {
          token:
            "Tautan reset tidak valid atau sudah kedaluwarsa. Minta tautan baru.",
        },
  );
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  function update<K extends keyof ResetPasswordFormValues>(
    field: K,
    value: ResetPasswordFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateResetPasswordForm(values, token);
    setErrors(nextErrors);

    const firstField = firstResetPasswordErrorField(nextErrors);
    if (firstField) {
      if (firstField === "token") {
        document.getElementById(`${formId}-token-error`)?.focus();
      } else {
        document.getElementById(`${formId}-${firstField}`)?.focus();
      }
      return;
    }

    const result = await confirmPasswordReset({
      token: token!.trim(),
      password: values.password,
    });

    if ("error" in result) {
      setErrors({ token: result.error });
      document.getElementById(`${formId}-token-error`)?.focus();
      return;
    }

    setStatus("saved");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <h2 className="text-xl font-semibold">Atur kata sandi baru</h2>
        </CardTitle>
        <CardDescription>
          Masukkan kata sandi baru untuk akun Anda. Tautan hanya berlaku sekali
          (simulasi).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {errors.token ? (
            <p
              id={`${formId}-token-error`}
              tabIndex={-1}
              className="text-destructive text-sm"
              role="alert"
            >
              {errors.token}{" "}
              <Link
                href="/masuk/lupa-kata-sandi"
                className="font-medium underline underline-offset-4"
              >
                Minta tautan baru
              </Link>
            </p>
          ) : null}
          <Field
            id={`${formId}-password`}
            label="Kata sandi baru"
            error={errors.password}
          >
            <Input
              id={`${formId}-password`}
              name="password"
              type="password"
              autoComplete="new-password"
              required
              aria-required="true"
              disabled={!token?.trim()}
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
            label="Ulangi kata sandi baru"
            error={errors.passwordConfirm}
          >
            <Input
              id={`${formId}-passwordConfirm`}
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              required
              aria-required="true"
              disabled={!token?.trim()}
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
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={!token?.trim()}
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 w-full px-4 sm:w-auto",
              })}
            >
              Simpan kata sandi baru
            </button>
            <p
              role="status"
              aria-live="polite"
              className="text-foreground text-sm"
            >
              {status === "saved" ? (
                <>
                  Kata sandi diperbarui (simulasi, belum ke server).{" "}
                  <Link
                    href="/masuk"
                    className="text-primary font-medium underline underline-offset-4"
                  >
                    Kembali ke halaman masuk
                  </Link>
                </>
              ) : (
                ""
              )}
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
