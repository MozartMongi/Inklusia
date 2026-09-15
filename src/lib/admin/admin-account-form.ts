export type AdminAccountFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AdminAccountEditFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AdminAccountFormErrors = Partial<
  Record<keyof AdminAccountFormValues, string>
>;

export const EMPTY_ADMIN_ACCOUNT_FORM: AdminAccountFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function validateAdminAccountCreateForm(
  values: AdminAccountFormValues,
): AdminAccountFormErrors {
  const errors: AdminAccountFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Nama lengkap wajib diisi.";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.password) {
    errors.password = "Kata sandi wajib diisi.";
  } else if (values.password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Konfirmasi kata sandi wajib diisi.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
  }

  return errors;
}

export function validateAdminAccountEditForm(
  values: AdminAccountEditFormValues,
): AdminAccountFormErrors {
  const errors: AdminAccountFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Nama lengkap wajib diisi.";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Format email tidak valid.";
  }

  if (values.password || values.confirmPassword) {
    if (values.password.length < 8) {
      errors.password = "Kata sandi baru minimal 8 karakter.";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
    }
  }

  return errors;
}

export function firstAdminAccountFormErrorField(
  errors: AdminAccountFormErrors,
): keyof AdminAccountFormValues | null {
  const order: (keyof AdminAccountFormValues)[] = [
    "fullName",
    "email",
    "password",
    "confirmPassword",
  ];
  return order.find((field) => errors[field]) ?? null;
}
