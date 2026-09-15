export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function validateProfileImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "Unggah gambar JPG, PNG, atau WebP.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "Ukuran berkas maksimal 2 MB.";
  }

  return null;
}
