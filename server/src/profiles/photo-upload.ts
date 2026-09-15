import type { RequestHandler } from "express";
import multer from "multer";

export const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024;

export const ACCEPTED_PROFILE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PROFILE_IMAGE_BYTES },
  fileFilter(_req, file, callback) {
    if (
      ACCEPTED_PROFILE_IMAGE_TYPES.includes(
        file.mimetype as (typeof ACCEPTED_PROFILE_IMAGE_TYPES)[number],
      )
    ) {
      callback(null, true);
      return;
    }
    callback(new Error("INVALID_IMAGE_TYPE"));
  },
});

export const profileImageUpload = upload.single("file");

export function imageExtension(mimeType: string): string {
  if (mimeType === "image/png") {
    return "png";
  }
  if (mimeType === "image/webp") {
    return "webp";
  }
  return "jpg";
}

export function multerErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const err = error as { code?: string; message?: string };
  if (err.code === "LIMIT_FILE_SIZE") {
    return "Ukuran berkas maksimal 2 MB.";
  }
  if (err.message === "INVALID_IMAGE_TYPE") {
    return "Unggah gambar JPG, PNG, atau WebP.";
  }
  return null;
}

export const handleProfileImageUpload: RequestHandler = (req, res, next) => {
  profileImageUpload(req, res, (error) => {
    const message = multerErrorMessage(error);
    if (message) {
      res.status(400).json({ error: message });
      return;
    }
    next(error);
  });
};
