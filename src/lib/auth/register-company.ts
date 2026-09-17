import {
  isValidCompanyWebsite,
  validateCompanyProfileFile,
} from "@/lib/auth/company-profile-document";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_INCLUSION_MESSAGE_LENGTH = 2000;

export type YesNoAnswer = "ya" | "tidak";
export type CompanyProfileKind = "file" | "website";

export type RegisterCompanyFormValues = {
  name: string;
  address: string;
  industry: string;
  profileKind: CompanyProfileKind | "";
  profileWebsite: string;
  profileFile: File | null;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactEmail: string;
  password: string;
  passwordConfirm: string;
  hasDisabilityEmployees: YesNoAnswer | "";
  disabilityWorkersNeeded: string;
  neededSkills: string;
  disabilityHirePlan: string;
  hasCsrOrGrant: YesNoAnswer | "";
  inclusionMessage: string;
};

export type RegisterCompanyFormErrors = Partial<
  Record<keyof RegisterCompanyFormValues, string>
>;

export const EMPTY_REGISTER_COMPANY_VALUES: RegisterCompanyFormValues = {
  name: "",
  address: "",
  industry: "",
  profileKind: "",
  profileWebsite: "",
  profileFile: null,
  contactName: "",
  contactPosition: "",
  contactPhone: "",
  contactEmail: "",
  password: "",
  passwordConfirm: "",
  hasDisabilityEmployees: "",
  disabilityWorkersNeeded: "",
  neededSkills: "",
  disabilityHirePlan: "",
  hasCsrOrGrant: "",
  inclusionMessage: "",
};

export function validateRegisterCompanyForm(
  values: RegisterCompanyFormValues,
): RegisterCompanyFormErrors {
  const errors: RegisterCompanyFormErrors = {};
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
  } else if (!values.profileFile) {
    errors.profileFile = "Unggah berkas profil perusahaan.";
  } else {
    const fileError = validateCompanyProfileFile(values.profileFile);
    if (fileError) {
      errors.profileFile = fileError;
    }
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

  if (!values.passwordConfirm) {
    errors.passwordConfirm = "Ulangi kata sandi.";
  } else if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = "Ulangan kata sandi tidak sama.";
  }

  if (!values.hasDisabilityEmployees) {
    errors.hasDisabilityEmployees =
      "Pilih apakah perusahaan sudah memiliki karyawan disabilitas.";
  }

  const workersNeeded = Number(values.disabilityWorkersNeeded);
  if (!values.disabilityWorkersNeeded.trim()) {
    errors.disabilityWorkersNeeded =
      "Jumlah pekerja disabilitas yang dibutuhkan wajib diisi.";
  } else if (
    !Number.isInteger(workersNeeded) ||
    workersNeeded < 1 ||
    workersNeeded > 10_000
  ) {
    errors.disabilityWorkersNeeded =
      "Masukkan angka bulat minimal 1 (maksimal 10.000).";
  }

  if (!values.neededSkills.trim()) {
    errors.neededSkills =
      "Keahlian yang dibutuhkan untuk pekerja disabilitas wajib diisi.";
  } else if (values.neededSkills.trim().length < 10) {
    errors.neededSkills = "Tuliskan minimal 10 karakter tentang keahlian yang dibutuhkan.";
  }

  if (values.hasDisabilityEmployees === "tidak") {
    if (!values.disabilityHirePlan.trim()) {
      errors.disabilityHirePlan =
        "Rencana penerapan pekerja disabilitas wajib diisi jika belum memiliki karyawan disabilitas.";
    } else if (values.disabilityHirePlan.trim().length < 10) {
      errors.disabilityHirePlan =
        "Tuliskan minimal 10 karakter tentang rencana penerapan.";
    }
  }

  if (!values.hasCsrOrGrant) {
    errors.hasCsrOrGrant =
      "Pilih apakah perusahaan memiliki program CSR atau dana hibah pelatihan.";
  }

  if (values.inclusionMessage.trim().length > MAX_INCLUSION_MESSAGE_LENGTH) {
    errors.inclusionMessage = `Pesan maksimal ${MAX_INCLUSION_MESSAGE_LENGTH.toLocaleString("id-ID")} karakter.`;
  }

  return errors;
}

export function firstRegisterCompanyErrorField(
  errors: RegisterCompanyFormErrors,
): keyof RegisterCompanyFormValues | null {
  const order: (keyof RegisterCompanyFormValues)[] = [
    "name",
    "address",
    "industry",
    "profileKind",
    "profileWebsite",
    "profileFile",
    "contactName",
    "contactPosition",
    "contactPhone",
    "contactEmail",
    "password",
    "passwordConfirm",
    "hasDisabilityEmployees",
    "disabilityWorkersNeeded",
    "neededSkills",
    "disabilityHirePlan",
    "hasCsrOrGrant",
    "inclusionMessage",
  ];
  return order.find((field) => errors[field]) ?? null;
}
