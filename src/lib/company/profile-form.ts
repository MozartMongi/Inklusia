export type CompanyProfileFormValues = {
  name: string;
  address: string;
  industry: string;
  nib: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactEmail: string;
};

export type CompanyProfileFormErrors = Partial<
  Record<keyof CompanyProfileFormValues, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCompanyProfileForm(
  values: CompanyProfileFormValues,
): CompanyProfileFormErrors {
  const errors: CompanyProfileFormErrors = {};
  const nibDigits = values.nib.replace(/\D/g, "");
  const phoneDigits = values.contactPhone.replace(/\D/g, "");

  if (!values.name.trim()) {
    errors.name = "Nama perusahaan wajib diisi.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Nama perusahaan minimal 3 karakter.";
  }

  if (!values.address.trim()) {
    errors.address = "Alamat perusahaan wajib diisi.";
  }

  if (!values.industry.trim()) {
    errors.industry = "Industri wajib diisi.";
  }

  if (!values.nib.trim()) {
    errors.nib = "NIB wajib diisi.";
  } else if (nibDigits.length !== 13) {
    errors.nib = "NIB harus 13 digit.";
  }

  if (!values.contactName.trim()) {
    errors.contactName = "Nama kontak person wajib diisi.";
  }

  if (!values.contactPosition.trim()) {
    errors.contactPosition = "Jabatan kontak person wajib diisi.";
  }

  if (!values.contactPhone.trim()) {
    errors.contactPhone = "Nomor telepon kontak person wajib diisi.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.contactPhone = "Nomor telepon harus 10 sampai 15 digit.";
  }

  if (!values.contactEmail.trim()) {
    errors.contactEmail = "Email kontak person wajib diisi.";
  } else if (!EMAIL_PATTERN.test(values.contactEmail.trim())) {
    errors.contactEmail = "Format email belum benar.";
  }

  return errors;
}

export function firstCompanyProfileErrorField(
  errors: CompanyProfileFormErrors,
): keyof CompanyProfileFormValues | null {
  const order: (keyof CompanyProfileFormValues)[] = [
    "name",
    "address",
    "industry",
    "nib",
    "contactName",
    "contactPosition",
    "contactPhone",
    "contactEmail",
  ];
  return order.find((field) => errors[field]) ?? null;
}
