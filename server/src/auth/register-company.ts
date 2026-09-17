export type YesNoAnswer = "ya" | "tidak";
export type CompanyProfileKind = "file" | "website";

export type RegisterCompanyInput = {
  name: string;
  address: string;
  industry: string;
  profileKind: CompanyProfileKind;
  profileWebsite: string;
  profileFileName: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactEmail: string;
  password: string;
  hasDisabilityEmployees: YesNoAnswer;
  disabilityWorkersNeeded: number;
  neededSkills: string;
  disabilityHirePlan: string | null;
  hasCsrOrGrant: YesNoAnswer;
  inclusionMessage: string;
};

export type RegisterCompanyErrors = Partial<
  Record<
    | "name"
    | "address"
    | "industry"
    | "profileKind"
    | "profileWebsite"
    | "profileFile"
    | "contactName"
    | "contactPosition"
    | "contactPhone"
    | "contactEmail"
    | "password"
    | "hasDisabilityEmployees"
    | "disabilityWorkersNeeded"
    | "neededSkills"
    | "disabilityHirePlan"
    | "hasCsrOrGrant"
    | "inclusionMessage",
    string
  >
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_INCLUSION_MESSAGE_LENGTH = 2000;

export function parseRegisterCompanyBody(body: unknown): {
  values: Omit<
    RegisterCompanyInput,
    "hasDisabilityEmployees" | "hasCsrOrGrant" | "disabilityWorkersNeeded" | "profileKind"
  > & {
    hasDisabilityEmployees: YesNoAnswer | "";
    hasCsrOrGrant: YesNoAnswer | "";
    disabilityWorkersNeeded: number | null;
    profileKind: CompanyProfileKind | "";
  };
} {
  const source = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  let disabilityWorkersNeeded: number | null = null;
  if (
    typeof source.disabilityWorkersNeeded === "number" &&
    Number.isFinite(source.disabilityWorkersNeeded)
  ) {
    disabilityWorkersNeeded = source.disabilityWorkersNeeded;
  } else if (
    typeof source.disabilityWorkersNeeded === "string" &&
    source.disabilityWorkersNeeded.trim()
  ) {
    const parsed = Number.parseInt(source.disabilityWorkersNeeded, 10);
    disabilityWorkersNeeded = Number.isNaN(parsed) ? null : parsed;
  }

  const profileWebsite =
    typeof source.profileWebsite === "string" ? source.profileWebsite : "";

  return {
    values: {
      name: typeof source.name === "string" ? source.name : "",
      address: typeof source.address === "string" ? source.address : "",
      industry: typeof source.industry === "string" ? source.industry : "",
      profileKind: parseProfileKind(source.profileKind),
      profileWebsite,
      profileFileName:
        typeof source.profileFileName === "string" ? source.profileFileName : "",
      contactName: typeof source.contactName === "string" ? source.contactName : "",
      contactPosition:
        typeof source.contactPosition === "string" ? source.contactPosition : "",
      contactPhone:
        typeof source.contactPhone === "string" ? source.contactPhone : "",
      contactEmail:
        typeof source.contactEmail === "string" ? source.contactEmail : "",
      password: typeof source.password === "string" ? source.password : "",
      hasDisabilityEmployees: parseYesNo(source.hasDisabilityEmployees),
      disabilityWorkersNeeded,
      neededSkills:
        typeof source.neededSkills === "string" ? source.neededSkills : "",
      disabilityHirePlan:
        typeof source.disabilityHirePlan === "string"
          ? source.disabilityHirePlan
          : source.disabilityHirePlan === null
            ? null
            : "",
      hasCsrOrGrant: parseYesNo(source.hasCsrOrGrant),
      inclusionMessage:
        typeof source.inclusionMessage === "string" ? source.inclusionMessage : "",
    },
  };
}

export function validateRegisterCompanyInput(values: {
  name: string;
  address: string;
  industry: string;
  profileKind: CompanyProfileKind | "";
  profileWebsite: string;
  profileFileName: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactEmail: string;
  password: string;
  hasDisabilityEmployees: YesNoAnswer | "";
  disabilityWorkersNeeded: number | null;
  neededSkills: string;
  disabilityHirePlan: string | null;
  hasCsrOrGrant: YesNoAnswer | "";
  inclusionMessage: string;
}): RegisterCompanyErrors {
  const errors: RegisterCompanyErrors = {};
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

  if (!values.profileKind) {
    errors.profileKind =
      "Pilih unggah berkas atau website untuk profil perusahaan.";
  } else if (values.profileKind === "website") {
    if (!values.profileWebsite.trim()) {
      errors.profileWebsite = "Alamat website perusahaan wajib diisi.";
    } else if (!isValidCompanyWebsite(values.profileWebsite)) {
      errors.profileWebsite = "Format alamat website belum benar.";
    }
  } else if (!values.profileFileName.trim()) {
    errors.profileFile = "Unggah berkas profil perusahaan.";
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

  if (!values.password) {
    errors.password = "Kata sandi wajib diisi.";
  } else if (values.password.length < 8) {
    errors.password = "Kata sandi minimal 8 karakter.";
  }

  if (!values.hasDisabilityEmployees) {
    errors.hasDisabilityEmployees =
      "Pilih apakah perusahaan sudah mempekerjakan penyandang disabilitas.";
  }

  if (
    values.disabilityWorkersNeeded === null ||
    !Number.isInteger(values.disabilityWorkersNeeded) ||
    values.disabilityWorkersNeeded < 1
  ) {
    errors.disabilityWorkersNeeded =
      "Jumlah pekerja disabilitas yang dibutuhkan minimal 1.";
  }

  if (!values.neededSkills.trim()) {
    errors.neededSkills = "Keahlian yang dibutuhkan wajib diisi.";
  }

  if (values.hasDisabilityEmployees === "tidak") {
    if (!values.disabilityHirePlan?.trim()) {
      errors.disabilityHirePlan =
        "Rencana perekrutan wajib diisi jika belum mempekerjakan penyandang disabilitas.";
    } else if (values.disabilityHirePlan.trim().length < 10) {
      errors.disabilityHirePlan = "Rencana perekrutan minimal 10 karakter.";
    }
  }

  if (!values.hasCsrOrGrant) {
    errors.hasCsrOrGrant =
      "Pilih apakah perusahaan memiliki program CSR atau hibah terkait inklusi.";
  }

  if (values.inclusionMessage.trim().length > MAX_INCLUSION_MESSAGE_LENGTH) {
    errors.inclusionMessage = `Pesan maksimal ${MAX_INCLUSION_MESSAGE_LENGTH.toLocaleString("id-ID")} karakter.`;
  }

  return errors;
}

export function normalizeCompanyWebsite(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function isValidCompanyWebsite(value: string): boolean {
  try {
    const url = new URL(normalizeCompanyWebsite(value));
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function parseYesNo(value: unknown): YesNoAnswer | "" {
  return value === "ya" || value === "tidak" ? value : "";
}

function parseProfileKind(value: unknown): CompanyProfileKind | "" {
  return value === "file" || value === "website" ? value : "";
}
