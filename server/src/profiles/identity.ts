import {
  JOB_SEEKER_DISABILITY_TYPES,
  type JobSeekerDisabilityType,
} from "../db/job-seeker-schema.js";

export type IdentityInput = {
  fullName: string;
  phone: string;
  address: string;
  disabilityType: JobSeekerDisabilityType | "";
  bio: string;
};

export type IdentityErrors = Partial<Record<keyof IdentityInput, string>>;

export function parseIdentityBody(body: unknown): IdentityInput {
  const source = body && typeof body === "object" ? body : {};
  const record = source as Record<string, unknown>;

  return {
    fullName: typeof record.fullName === "string" ? record.fullName : "",
    phone: typeof record.phone === "string" ? record.phone : "",
    address: typeof record.address === "string" ? record.address : "",
    disabilityType: parseDisabilityType(record.disabilityType),
    bio: typeof record.bio === "string" ? record.bio : "",
  };
}

export function validateIdentityInput(values: IdentityInput): IdentityErrors {
  const errors: IdentityErrors = {};

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

function parseDisabilityType(
  value: unknown,
): JobSeekerDisabilityType | "" {
  if (
    typeof value === "string" &&
    (JOB_SEEKER_DISABILITY_TYPES as readonly string[]).includes(value)
  ) {
    return value as JobSeekerDisabilityType;
  }
  return "";
}
