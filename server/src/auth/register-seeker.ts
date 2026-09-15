import {
  JOB_SEEKER_DISABILITY_TYPES,
  SKILL_LEVELS,
  type JobSeekerDisabilityType,
  type SkillLevel,
} from "../db/job-seeker-schema.js";

export type RegisterSeekerSkillInput = {
  skillName: string;
  level: SkillLevel;
};

export type RegisterSeekerCertificationInput = {
  name: string;
  issuer: string;
  year: string;
};

export type RegisterSeekerExperienceInput = {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
};

export type RegisterSeekerInput = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  disabilityType: JobSeekerDisabilityType;
  disabilityNotes: string;
  photoFileName: string;
  ktpFileName: string;
  skills: RegisterSeekerSkillInput[];
  certifications: RegisterSeekerCertificationInput[];
  experiences: RegisterSeekerExperienceInput[];
};

export type RegisterSeekerErrors = Partial<
  Record<
    | "fullName"
    | "email"
    | "password"
    | "phone"
    | "address"
    | "disabilityType"
    | "disabilityNotes"
    | "photoFileName"
    | "ktpFileName"
    | "skills"
    | "certifications"
    | "experiences",
    string
  >
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseRegisterSeekerBody(body: unknown): {
  values: Omit<RegisterSeekerInput, "disabilityType"> & {
    disabilityType: JobSeekerDisabilityType | "";
  };
} {
  const source = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const disabilityRaw =
    typeof source.disabilityType === "string" ? source.disabilityType : "";

  return {
    values: {
      fullName: typeof source.fullName === "string" ? source.fullName : "",
      email: typeof source.email === "string" ? source.email : "",
      password: typeof source.password === "string" ? source.password : "",
      phone: typeof source.phone === "string" ? source.phone : "",
      address: typeof source.address === "string" ? source.address : "",
      disabilityType: (
        JOB_SEEKER_DISABILITY_TYPES as readonly string[]
      ).includes(disabilityRaw)
        ? (disabilityRaw as JobSeekerDisabilityType)
        : "",
      disabilityNotes:
        typeof source.disabilityNotes === "string"
          ? source.disabilityNotes
          : "",
      photoFileName:
        typeof source.photoFileName === "string" ? source.photoFileName : "",
      ktpFileName:
        typeof source.ktpFileName === "string" ? source.ktpFileName : "",
      skills: parseSkills(source.skills),
      certifications: parseCertifications(source.certifications),
      experiences: parseExperiences(source.experiences),
    },
  };
}

export function validateRegisterSeekerInput(values: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  disabilityType: JobSeekerDisabilityType | "";
  disabilityNotes: string;
  photoFileName: string;
  ktpFileName: string;
  skills: RegisterSeekerSkillInput[];
  certifications: RegisterSeekerCertificationInput[];
  experiences: RegisterSeekerExperienceInput[];
}): RegisterSeekerErrors {
  const errors: RegisterSeekerErrors = {};
  const phoneDigits = values.phone.replace(/\D/g, "");

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
      "Tuliskan minimal 20 karakter tentang kondisi atau akomodasi.";
  }

  if (!values.photoFileName.trim()) {
    errors.photoFileName = "Foto diri wajib diunggah.";
  }

  if (!values.ktpFileName.trim()) {
    errors.ktpFileName = "Foto KTP wajib diunggah.";
  }

  const invalidSkill = values.skills.find(
    (skill) =>
      !skill.skillName.trim() ||
      !(SKILL_LEVELS as readonly string[]).includes(skill.level),
  );
  if (invalidSkill) {
    errors.skills = "Setiap keahlian harus punya nama dan level yang valid.";
  }

  const invalidCert = values.certifications.find((item) => !item.name.trim());
  if (invalidCert) {
    errors.certifications = "Nama sertifikasi wajib diisi.";
  }

  const invalidExperience = values.experiences.find(
    (item) =>
      !item.companyName.trim() ||
      !item.position.trim() ||
      !item.startDate.trim() ||
      !item.description.trim(),
  );
  if (invalidExperience) {
    errors.experiences = "Data pengalaman kerja belum lengkap.";
  }

  return errors;
}

function parseSkills(value: unknown): RegisterSeekerSkillInput[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const record = item as Record<string, unknown>;
      const level = typeof record.level === "string" ? record.level : "";
      if (!(SKILL_LEVELS as readonly string[]).includes(level)) {
        return {
          skillName:
            typeof record.skillName === "string" ? record.skillName : "",
          level: "dasar" as SkillLevel,
        };
      }
      return {
        skillName: typeof record.skillName === "string" ? record.skillName : "",
        level: level as SkillLevel,
      };
    })
    .filter((item): item is RegisterSeekerSkillInput => item !== null);
}

function parseCertifications(
  value: unknown,
): RegisterSeekerCertificationInput[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const record = item as Record<string, unknown>;
      return {
        name: typeof record.name === "string" ? record.name : "",
        issuer: typeof record.issuer === "string" ? record.issuer : "",
        year: typeof record.year === "string" ? record.year : "",
      };
    })
    .filter((item): item is RegisterSeekerCertificationInput => item !== null);
}

function parseExperiences(value: unknown): RegisterSeekerExperienceInput[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const record = item as Record<string, unknown>;
      return {
        companyName:
          typeof record.companyName === "string" ? record.companyName : "",
        position: typeof record.position === "string" ? record.position : "",
        startDate: typeof record.startDate === "string" ? record.startDate : "",
        endDate:
          typeof record.endDate === "string" && record.endDate.trim()
            ? record.endDate
            : null,
        description:
          typeof record.description === "string" ? record.description : "",
      };
    })
    .filter((item): item is RegisterSeekerExperienceInput => item !== null);
}
