export type YesNoAnswer = "ya" | "tidak";

export type RegisterCompanyInput = {
  name: string;
  address: string;
  industry: string;
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
};

export type RegisterCompanyErrors = Partial<
  Record<
    | "name"
    | "address"
    | "industry"
    | "contactName"
    | "contactPosition"
    | "contactPhone"
    | "contactEmail"
    | "password"
    | "hasDisabilityEmployees"
    | "disabilityWorkersNeeded"
    | "neededSkills"
    | "disabilityHirePlan"
    | "hasCsrOrGrant",
    string
  >
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseRegisterCompanyBody(body: unknown): {
  values: Omit<
    RegisterCompanyInput,
    "hasDisabilityEmployees" | "hasCsrOrGrant" | "disabilityWorkersNeeded"
  > & {
    hasDisabilityEmployees: YesNoAnswer | "";
    hasCsrOrGrant: YesNoAnswer | "";
    disabilityWorkersNeeded: number | null;
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

  return {
    values: {
      name: typeof source.name === "string" ? source.name : "",
      address: typeof source.address === "string" ? source.address : "",
      industry: typeof source.industry === "string" ? source.industry : "",
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
    },
  };
}

export function validateRegisterCompanyInput(values: {
  name: string;
  address: string;
  industry: string;
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

  return errors;
}

function parseYesNo(value: unknown): YesNoAnswer | "" {
  return value === "ya" || value === "tidak" ? value : "";
}
