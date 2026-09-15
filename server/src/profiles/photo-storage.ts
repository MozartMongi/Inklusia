import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { JobSeekerPhotoKind } from "../db/job-seeker-schema.js";
import { imageExtension } from "./photo-upload.js";

const uploadsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads",
);

export async function saveProfileImage(input: {
  profileId: string;
  kind: JobSeekerPhotoKind;
  mimeType: string;
  buffer: Buffer;
}): Promise<string> {
  const directory = path.join(uploadsRoot, "job-seekers", input.profileId);
  await fs.mkdir(directory, { recursive: true });

  const filename = `${input.kind}.${imageExtension(input.mimeType)}`;
  await fs.writeFile(path.join(directory, filename), input.buffer);

  return `/uploads/job-seekers/${input.profileId}/${filename}`;
}

export const uploadsDirectory = uploadsRoot;
