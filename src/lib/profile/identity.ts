import {
  JOB_SEEKER_DISABILITY_LABEL,
  type JobSeekerDisabilityType,
} from "@/lib/types/job-seeker";

export type IdentityFormValues = {
  fullName: string;
  phone: string;
  address: string;
  disabilityType: JobSeekerDisabilityType | "";
  bio: string;
};

export type IdentityFormErrors = Partial<Record<keyof IdentityFormValues, string>>;

export const IDENTITY_DISABILITY_OPTIONS = (
  Object.keys(JOB_SEEKER_DISABILITY_LABEL) as JobSeekerDisabilityType[]
).map((value) => ({
  value,
  label: JOB_SEEKER_DISABILITY_LABEL[value],
}));

export function validateIdentityForm(
  values: IdentityFormValues,
): IdentityFormErrors {
  const errors: IdentityFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Nama lengkap wajib diisi.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "Nama lengkap minimal 3 karakter.";
  }

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    errors.phone = "Nomor telepon wajib diisi.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "Nomor telepon harus 10 sampai 15 digit.";
  }

  if (!values.address.trim()) {
    errors.address = "Alamat wajib diisi.";
  }

  if (!values.disabilityType) {
    errors.disabilityType = "Jenis disabilitas wajib dipilih.";
  }

  if (!values.bio.trim()) {
    errors.bio = "Bagian tentang saya wajib diisi.";
  } else if (values.bio.trim().length < 20) {
    errors.bio = "Tuliskan minimal 20 karakter tentang diri Anda.";
  }

  return errors;
}

export function firstIdentityErrorField(
  errors: IdentityFormErrors,
): keyof IdentityFormValues | null {
  const order: (keyof IdentityFormValues)[] = [
    "fullName",
    "phone",
    "address",
    "disabilityType",
    "bio",
  ];
  return order.find((field) => errors[field]) ?? null;
}
