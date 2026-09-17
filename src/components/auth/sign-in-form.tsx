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
import { login } from "@/lib/api/auth";
import {
  EMPTY_LOGIN_VALUES,
  firstLoginErrorField,
  validateLoginForm,
  type LoginFormErrors,
  type LoginFormValues,
} from "@/lib/auth/login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

export function SignInForm() {
  const formId = useId();
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>(EMPTY_LOGIN_VALUES);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  function update<K extends keyof LoginFormValues>(
    field: K,
    value: LoginFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    if (errors[field] || errors.form) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
        form: undefined,
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    setStatus("idle");

    const firstField = firstLoginErrorField(nextErrors);
    if (firstField && firstField !== "form") {
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    const result = await login({
      email: values.email.trim(),
      password: values.password,
    });

    if ("error" in result) {
      setErrors({ form: result.error });
      document.getElementById(`${formId}-form-error`)?.focus();
      return;
    }

    setStatus("saved");
    router.push(result.data.redirectTo ?? "/");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <h2 className="text-xl font-semibold">Form masuk</h2>
        </CardTitle>
        <CardDescription>
          Email dan kata sandi akun Anda. Pesan kesalahan tampil di bawah kolom
          yang bermasalah.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {errors.form ? (
            <p
              id={`${formId}-form-error`}
              tabIndex={-1}
              className="text-destructive text-sm"
              role="alert"
            >
              {errors.form}
            </p>
          ) : null}
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
              autoComplete="current-password"
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
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 w-full px-4 sm:w-auto",
              })}
            >
              Masuk
            </button>
            <p className="text-sm">
              <Link
                href="/masuk/lupa-kata-sandi"
                className="text-primary font-medium underline underline-offset-4"
              >
                Lupa kata sandi?
              </Link>
            </p>
            <p
              role="status"
              aria-live="polite"
              className="text-foreground text-sm"
            >
              {status === "saved" ? "Berhasil masuk. Mengalihkan…" : ""}
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
