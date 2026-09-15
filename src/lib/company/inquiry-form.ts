import type { CompanyInquiry } from "@/lib/types/inquiry";
import {
  DISABILITY_FRIENDLY_LABEL,
  JOB_TYPE_LABEL,
  type DisabilityFriendlyType,
  type JobType,
} from "@/lib/types/job";

export type InquiryFormValues = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: JobType | "";
  disabilityFriendlyType: DisabilityFriendlyType | "";
  headcount: string;
};

export type InquiryFormErrors = Partial<Record<keyof InquiryFormValues, string>>;

export function inquiryToFormValues(inquiry: CompanyInquiry): InquiryFormValues {
  return {
    title: inquiry.title,
    description: inquiry.description,
    requirements: inquiry.requirements,
    location: inquiry.location,
    jobType: inquiry.jobType,
    disabilityFriendlyType: inquiry.disabilityFriendlyType,
    headcount: String(inquiry.headcount),
  };
}

export const EMPTY_INQUIRY_FORM_VALUES: InquiryFormValues = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  jobType: "",
  disabilityFriendlyType: "",
  headcount: "1",
};

export const INQUIRY_JOB_TYPE_OPTIONS = (
  Object.keys(JOB_TYPE_LABEL) as JobType[]
).map((value) => ({
  value,
  label: JOB_TYPE_LABEL[value],
}));

export const INQUIRY_DISABILITY_OPTIONS = (
  Object.keys(DISABILITY_FRIENDLY_LABEL) as DisabilityFriendlyType[]
).map((value) => ({
  value,
  label: DISABILITY_FRIENDLY_LABEL[value],
}));

export function validateInquiryForm(values: InquiryFormValues): InquiryFormErrors {
  const errors: InquiryFormErrors = {};
  const headcount = Number.parseInt(values.headcount, 10);

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
    errors.disabilityFriendlyType = "Jenis disabilitas yang didukung wajib dipilih.";
  }

  if (!values.headcount.trim()) {
    errors.headcount = "Jumlah karyawan wajib diisi.";
  } else if (!Number.isInteger(headcount) || headcount < 1 || headcount > 99) {
    errors.headcount = "Jumlah karyawan harus 1 sampai 99.";
  }

  return errors;
}

export function firstInquiryErrorField(
  errors: InquiryFormErrors,
): keyof InquiryFormValues | null {
  const order: (keyof InquiryFormValues)[] = [
    "title",
    "description",
    "requirements",
    "location",
    "jobType",
    "disabilityFriendlyType",
    "headcount",
  ];
  return order.find((field) => errors[field]) ?? null;
}
