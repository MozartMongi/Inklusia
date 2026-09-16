export type CompanyProfileInput = {
  name: string;
  address: string;
  industry: string;
  nib: string;
  contactPerson: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
};

export type CompanyProfileErrors = Partial<{
  name: string;
  address: string;
  industry: string;
  nib: string;
  contactPerson: {
    name?: string;
    position?: string;
    phone?: string;
    email?: string;
  };
}>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseCompanyProfileBody(body: unknown): CompanyProfileInput {
  const source = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const contactSource =
    source.contactPerson && typeof source.contactPerson === "object"
      ? (source.contactPerson as Record<string, unknown>)
      : {};

  return {
    name: typeof source.name === "string" ? source.name : "",
    address: typeof source.address === "string" ? source.address : "",
    industry: typeof source.industry === "string" ? source.industry : "",
    nib: typeof source.nib === "string" ? source.nib : "",
    contactPerson: {
      name: typeof contactSource.name === "string" ? contactSource.name : "",
      position:
        typeof contactSource.position === "string" ? contactSource.position : "",
      phone: typeof contactSource.phone === "string" ? contactSource.phone : "",
      email: typeof contactSource.email === "string" ? contactSource.email : "",
    },
  };
}

export function validateCompanyProfileInput(
  values: CompanyProfileInput,
): CompanyProfileErrors {
  const errors: CompanyProfileErrors = {};
  const contactErrors: NonNullable<CompanyProfileErrors["contactPerson"]> = {};
  const nibDigits = values.nib.replace(/\D/g, "");
  const phoneDigits = values.contactPerson.phone.replace(/\D/g, "");

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

  if (!values.contactPerson.name.trim()) {
    contactErrors.name = "Nama kontak person wajib diisi.";
  }

  if (!values.contactPerson.position.trim()) {
    contactErrors.position = "Jabatan kontak person wajib diisi.";
  }

  if (!values.contactPerson.phone.trim()) {
    contactErrors.phone = "Nomor telepon kontak person wajib diisi.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    contactErrors.phone = "Nomor telepon harus 10 sampai 15 digit.";
  }

  if (!values.contactPerson.email.trim()) {
    contactErrors.email = "Email kontak person wajib diisi.";
  } else if (!EMAIL_PATTERN.test(values.contactPerson.email.trim())) {
    contactErrors.email = "Format email belum benar.";
  }

  if (Object.keys(contactErrors).length > 0) {
    errors.contactPerson = contactErrors;
  }

  return errors;
}

export function hasCompanyProfileErrors(errors: CompanyProfileErrors): boolean {
  return Object.keys(errors).length > 0;
}
