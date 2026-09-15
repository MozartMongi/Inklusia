export type ResetPasswordFormValues = {
  password: string;
  passwordConfirm: string;
};

export type ResetPasswordFormErrors = Partial<
  Record<keyof ResetPasswordFormValues, string>
> & {
  token?: string;
};

export const EMPTY_RESET_PASSWORD_VALUES: ResetPasswordFormValues = {
  password: "",
  passwordConfirm: "",
};

/** Token stub untuk tautan contoh di frontend. */
export const MOCK_RESET_PASSWORD_TOKEN = "demo-reset-token";

export function validateResetPasswordForm(
  values: ResetPasswordFormValues,
  token: string | null,
): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {};

  if (!token?.trim()) {
    errors.token =
      "Tautan reset tidak valid atau sudah kedaluwarsa. Minta tautan baru.";
  }

  if (!values.password) {
    errors.password = "Kata sandi baru wajib diisi.";
  } else if (values.password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter.";
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = "Ulangi kata sandi baru.";
  } else if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = "Ulangan kata sandi tidak sama.";
  }

  return errors;
}

export function firstResetPasswordErrorField(
  errors: ResetPasswordFormErrors,
): keyof ResetPasswordFormValues | "token" | null {
  if (errors.token) {
    return "token";
  }
  if (errors.password) {
    return "password";
  }
  if (errors.passwordConfirm) {
    return "passwordConfirm";
  }
  return null;
}
