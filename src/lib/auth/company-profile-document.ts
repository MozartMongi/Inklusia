export const ACCEPTED_COMPANY_PROFILE_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_COMPANY_PROFILE_FILE_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const;

export const MAX_COMPANY_PROFILE_FILE_BYTES = 5 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = new Set<string>(
  ACCEPTED_COMPANY_PROFILE_FILE_EXTENSIONS,
);

export const COMPANY_PROFILE_FILE_ACCEPT = [
  ...ACCEPTED_COMPANY_PROFILE_FILE_TYPES,
  ...ACCEPTED_COMPANY_PROFILE_FILE_EXTENSIONS,
].join(",");

export function validateCompanyProfileFile(file: File): string | null {
  const extension = fileExtension(file.name);
  const typeOk = ACCEPTED_COMPANY_PROFILE_FILE_TYPES.includes(
    file.type as (typeof ACCEPTED_COMPANY_PROFILE_FILE_TYPES)[number],
  );
  const extensionOk = ACCEPTED_EXTENSIONS.has(extension);

  if (!typeOk && !extensionOk) {
    return "Unggah berkas PDF, Word, JPG, PNG, atau WebP.";
  }

  if (file.size > MAX_COMPANY_PROFILE_FILE_BYTES) {
    return "Ukuran berkas maksimal 5 MB.";
  }

  return null;
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

export function isValidCompanyWebsite(value: string): boolean {
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

function fileExtension(fileName: string): string {
  const index = fileName.lastIndexOf(".");
  if (index < 0) {
    return "";
  }
  return fileName.slice(index).toLowerCase();
}
