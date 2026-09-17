export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>> & {
  form?: string;
};

export const EMPTY_LOGIN_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.password) {
    errors.password = "Kata sandi wajib diisi.";
  }

  return errors;
}

export function firstLoginErrorField(
  errors: LoginFormErrors,
): keyof LoginFormValues | "form" | null {
  if (errors.email) {
    return "email";
  }
  if (errors.password) {
    return "password";
  }
  if (errors.form) {
    return "form";
  }
  return null;
}
