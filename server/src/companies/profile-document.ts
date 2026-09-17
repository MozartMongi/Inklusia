import type { RequestHandler } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import { uploadsDirectory } from "../profiles/photo-storage.js";

export const MAX_COMPANY_PROFILE_FILE_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_COMPANY_PROFILE_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const ACCEPTED_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_COMPANY_PROFILE_FILE_BYTES },
  fileFilter(_req, file, callback) {
    if (isAcceptedCompanyProfileFile(file.mimetype, file.originalname)) {
      callback(null, true);
      return;
    }
    callback(new Error("INVALID_PROFILE_FILE_TYPE"));
  },
});

const companyProfileUpload = upload.single("profileFile");

export function isAcceptedCompanyProfileFile(
  mimeType: string,
  originalName: string,
): boolean {
  const typeOk = ACCEPTED_COMPANY_PROFILE_FILE_TYPES.includes(
    mimeType as (typeof ACCEPTED_COMPANY_PROFILE_FILE_TYPES)[number],
  );
  return typeOk || ACCEPTED_EXTENSIONS.has(fileExtension(originalName));
}

export function companyProfileFileErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const err = error as { code?: string; message?: string };
  if (err.code === "LIMIT_FILE_SIZE") {
    return "Ukuran berkas maksimal 5 MB.";
  }
  if (err.message === "INVALID_PROFILE_FILE_TYPE") {
    return "Unggah berkas PDF, Word, JPG, PNG, atau WebP.";
  }
  return null;
}

export const handleCompanyProfileUpload: RequestHandler = (req, res, next) => {
  const contentType = req.headers["content-type"] ?? "";
  if (!contentType.includes("multipart/form-data")) {
    next();
    return;
  }

  companyProfileUpload(req, res, (error) => {
    const message = companyProfileFileErrorMessage(error);
    if (message) {
      res.status(400).json({
        error: message,
        errors: { profileFile: message },
      });
      return;
    }
    next(error);
  });
};

export async function saveCompanyProfileFile(input: {
  companyId: string;
  originalName: string;
  mimeType: string;
  buffer: Buffer;
}): Promise<{ fileName: string; filePath: string }> {
  const directory = path.join(uploadsDirectory, "companies", input.companyId);
  await fs.mkdir(directory, { recursive: true });

  const filename = `profil.${companyProfileExtension(
    input.mimeType,
    input.originalName,
  )}`;
  await fs.writeFile(path.join(directory, filename), input.buffer);

  return {
    fileName: sanitizeOriginalName(input.originalName),
    filePath: `/uploads/companies/${input.companyId}/${filename}`,
  };
}

function companyProfileExtension(mimeType: string, originalName: string): string {
  const fromMime = EXTENSION_BY_MIME[mimeType];
  if (fromMime) {
    return fromMime;
  }
  const extension = fileExtension(originalName).slice(1);
  if (extension === "jpeg") {
    return "jpg";
  }
  if (ACCEPTED_EXTENSIONS.has(`.${extension}`)) {
    return extension;
  }
  return "bin";
}

function fileExtension(fileName: string): string {
  const index = fileName.lastIndexOf(".");
  if (index < 0) {
    return "";
  }
  return fileName.slice(index).toLowerCase();
}

function sanitizeOriginalName(fileName: string): string {
  const cleaned = fileName.replace(/[/\\]/g, "").trim() || "profil-perusahaan";
  return cleaned.slice(0, 255);
}
