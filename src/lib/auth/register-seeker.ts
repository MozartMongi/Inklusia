import { IDENTITY_DISABILITY_OPTIONS } from "@/lib/profile/identity";
import { validateExperienceForm } from "@/lib/profile/experience";
import type {
  JobSeekerDisabilityType,
  SkillLevel,
} from "@/lib/types/job-seeker";

export type RegisterSeekerSkillDraft = {
  id: string;
  skillName: string;
  level: SkillLevel;
};

export type RegisterSeekerCertificationDraft = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type RegisterSeekerExperienceDraft = {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type RegisterSeekerFormValues = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  address: string;
  disabilityType: JobSeekerDisabilityType | "";
  disabilityNotes: string;
  photoName: string;
  ktpName: string;
};

export type RegisterSeekerFormErrors = Partial<
  Record<keyof RegisterSeekerFormValues, string>
> & {
  skills?: string;
  certifications?: string;
  experiences?: string;
};

export const EMPTY_REGISTER_SEEKER_VALUES: RegisterSeekerFormValues = {
  fullName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  phone: "",
  address: "",
  disabilityType: "",
  disabilityNotes: "",
  photoName: "",
  ktpName: "",
};

export const REGISTER_DISABILITY_OPTIONS = IDENTITY_DISABILITY_OPTIONS;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterSeekerForm(
  values: RegisterSeekerFormValues,
  skills: RegisterSeekerSkillDraft[],
  certifications: RegisterSeekerCertificationDraft[],
  experiences: RegisterSeekerExperienceDraft[],
): RegisterSeekerFormErrors {
  const errors: RegisterSeekerFormErrors = {};
  const currentYear = new Date().getFullYear();

  if (!values.fullName.trim()) {
    errors.fullName = "Nama lengkap wajib diisi.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "Nama lengkap minimal 3 karakter.";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Format email tidak valid.";
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

  if (!values.disabilityNotes.trim()) {
    errors.disabilityNotes = "Keterangan disabilitas wajib diisi.";
  } else if (values.disabilityNotes.trim().length < 20) {
    errors.disabilityNotes =
      "Tuliskan minimal 20 karakter tentang kondisi atau akomodasi yang dibutuhkan.";
  }

  if (!values.photoName) {
    errors.photoName = "Foto diri wajib diunggah.";
  }

  if (!values.ktpName) {
    errors.ktpName = "Foto KTP wajib diunggah.";
  }

  const incompleteSkill = skills.find((skill) => !skill.skillName.trim());
  if (incompleteSkill) {
    errors.skills = "Nama keahlian yang ditambahkan tidak boleh kosong.";
  }

  const invalidCertification = certifications.find((certification) => {
    if (!certification.name.trim()) {
      return true;
    }
    if (certification.year.trim()) {
      const year = Number(certification.year);
      if (
        !Number.isInteger(year) ||
        year < 1950 ||
        year > currentYear + 1
      ) {
        return true;
      }
    }
    return false;
  });
  if (invalidCertification) {
    errors.certifications =
      "Lengkapi nama sertifikasi yang ditambahkan. Tahun, jika diisi, harus antara 1950 dan tahun depan.";
  }

  const invalidExperience = experiences.find((experience) => {
    const result = validateExperienceForm({
      companyName: experience.companyName,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      description: experience.description,
    });
    return Object.keys(result).length > 0;
  });
  if (invalidExperience) {
    errors.experiences =
      "Lengkapi pengalaman kerja yang ditambahkan, atau hapus baris yang kosong.";
  }

  return errors;
}

export function firstRegisterSeekerErrorField(
  errors: RegisterSeekerFormErrors,
):
  | keyof RegisterSeekerFormValues
  | "skills"
  | "certifications"
  | "experiences"
  | null {
  const order: Array<
    | keyof RegisterSeekerFormValues
    | "skills"
    | "certifications"
    | "experiences"
  > = [
    "fullName",
    "email",
    "phone",
    "address",
    "disabilityType",
    "disabilityNotes",
    "password",
    "passwordConfirm",
    "photoName",
    "ktpName",
    "skills",
    "certifications",
    "experiences",
  ];
  return order.find((field) => errors[field]) ?? null;
}
