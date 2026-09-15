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
import { requestPasswordReset } from "@/lib/api/auth";
import {
  EMPTY_FORGOT_PASSWORD_VALUES,
  validateForgotPasswordForm,
  type ForgotPasswordFormErrors,
  type ForgotPasswordFormValues,
} from "@/lib/auth/forgot-password";
import { MOCK_RESET_PASSWORD_TOKEN } from "@/lib/auth/reset-password";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

export function ForgotPasswordForm() {
  const formId = useId();
  const [values, setValues] = useState<ForgotPasswordFormValues>(
    EMPTY_FORGOT_PASSWORD_VALUES,
  );
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function updateEmail(value: string) {
    setValues({ email: value });
    setStatus("idle");
    if (errors.email) {
      setErrors({});
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForgotPasswordForm(values);
    setErrors(nextErrors);

    if (nextErrors.email) {
      document.getElementById(`${formId}-email`)?.focus();
      return;
    }

    await requestPasswordReset({ email: values.email.trim() });
    setStatus("sent");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <h2 className="text-xl font-semibold">Minta tautan reset</h2>
        </CardTitle>
        <CardDescription>
          Masukkan email akun. Jika terdaftar, tautan reset akan dikirim
          (simulasi di frontend).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${formId}-email`} className="text-sm">
              Email{" "}
              <span aria-hidden="true" className="text-destructive">
                *
              </span>
              <span className="sr-only"> (wajib)</span>
            </Label>
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
              onChange={(event) => updateEmail(event.target.value)}
              className="min-h-11"
            />
            {errors.email ? (
              <p
                id={`${formId}-email-error`}
                className="text-destructive text-sm"
                role="alert"
              >
                {errors.email}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 w-full px-4 sm:w-auto",
              })}
            >
              Kirim tautan reset
            </button>
            <p
              role="status"
              aria-live="polite"
              className="text-foreground text-sm"
            >
              {status === "sent" ? (
                <>
                  Jika email terdaftar, tautan reset telah dikirim (simulasi).{" "}
                  <Link
                    href={`/masuk/reset-kata-sandi?token=${MOCK_RESET_PASSWORD_TOKEN}`}
                    className="text-primary font-medium underline underline-offset-4"
                  >
                    Buka halaman konfirmasi contoh
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
