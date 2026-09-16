import {
  isInquiryDisabilityFriendlyType,
  isInquiryJobType,
} from "../db/inquiry-schema.js";
import type { DisabilityFriendlyType, JobType } from "../db/jobs-schema.js";
import type { CreateInquiryInput } from "./inquiries.repository.js";

export type InquiryInputErrors = Partial<
  Record<
    | "title"
    | "description"
    | "requirements"
    | "location"
    | "jobType"
    | "disabilityFriendlyType"
    | "headcount",
    string
  >
>;

type ParsedInquiryBody = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: JobType | "";
  disabilityFriendlyType: DisabilityFriendlyType | "";
  headcount: number | null;
};

export function parseInquiryBody(body: unknown): ParsedInquiryBody {
  const source = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const jobTypeRaw = typeof source.jobType === "string" ? source.jobType : "";
  const disabilityRaw =
    typeof source.disabilityFriendlyType === "string"
      ? source.disabilityFriendlyType
      : "";

  let headcount: number | null = null;
  if (typeof source.headcount === "number" && Number.isFinite(source.headcount)) {
    headcount = source.headcount;
  } else if (typeof source.headcount === "string" && source.headcount.trim()) {
    const parsed = Number.parseInt(source.headcount, 10);
    headcount = Number.isNaN(parsed) ? null : parsed;
  }

  return {
    title: typeof source.title === "string" ? source.title : "",
    description: typeof source.description === "string" ? source.description : "",
    requirements:
      typeof source.requirements === "string" ? source.requirements : "",
    location: typeof source.location === "string" ? source.location : "",
    jobType: isInquiryJobType(jobTypeRaw) ? jobTypeRaw : "",
    disabilityFriendlyType: isInquiryDisabilityFriendlyType(disabilityRaw)
      ? disabilityRaw
      : "",
    headcount,
  };
}

export function validateInquiryInput(
  values: ParsedInquiryBody,
): InquiryInputErrors {
  const errors: InquiryInputErrors = {};

  if (!values.title.trim()) {
    errors.title = "Nama posisi wajib diisi.";
  } else if (values.title.trim().length < 3) {
    errors.title = "Nama posisi minimal 3 karakter.";
  }

  if (!values.description.trim()) {
    errors.description = "Uraian kebutuhan wajib diisi.";
  } else if (values.description.trim().length < 20) {
    errors.description = "Tuliskan minimal 20 karakter tentang kebutuhan ini.";
  }

  if (!values.requirements.trim()) {
    errors.requirements = "Persyaratan wajib diisi.";
  }

  if (!values.location.trim()) {
    errors.location = "Lokasi kerja wajib diisi.";
  }

  if (!values.jobType) {
    errors.jobType = "Jenis pekerjaan wajib dipilih.";
  }

  if (!values.disabilityFriendlyType) {
    errors.disabilityFriendlyType =
      "Jenis disabilitas yang didukung wajib dipilih.";
  }

  if (values.headcount === null) {
    errors.headcount = "Jumlah karyawan wajib diisi.";
  } else if (
    !Number.isInteger(values.headcount) ||
    values.headcount < 1 ||
    values.headcount > 99
  ) {
    errors.headcount = "Jumlah karyawan harus 1 sampai 99.";
  }

  return errors;
}

export function toCreateInquiryInput(
  values: ParsedInquiryBody,
): CreateInquiryInput | null {
  if (
    !values.jobType ||
    !values.disabilityFriendlyType ||
    values.headcount === null
  ) {
    return null;
  }

  return {
    title: values.title,
    description: values.description,
    requirements: values.requirements,
    location: values.location,
    jobType: values.jobType,
    disabilityFriendlyType: values.disabilityFriendlyType,
    headcount: values.headcount,
  };
}
