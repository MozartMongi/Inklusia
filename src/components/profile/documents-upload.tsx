"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { initialsFromName } from "@/lib/profile/format";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  validateProfileImage,
} from "@/lib/profile/documents";
import type { JobSeekerProfile } from "@/lib/types/job-seeker";
import { FileImage } from "lucide-react";
import { useEffect, useId, useState } from "react";

type DocumentsUploadProps = {
  profile: JobSeekerProfile;
};

type PreviewState = {
  src: string | null;
  fileName: string | null;
  objectUrl: string | null;
};

export function DocumentsUpload({ profile }: DocumentsUploadProps) {
  const formId = useId();
  const [photo, setPhoto] = useState<PreviewState>({
    src: profile.photoUrl,
    fileName: null,
    objectUrl: null,
  });
  const [ktp, setKtp] = useState<PreviewState>({
    src: profile.ktpPhotoUrl,
    fileName: profile.ktpPhotoUrl ? "ktp-contoh.svg" : null,
    objectUrl: null,
  });
  const [errors, setErrors] = useState<{ photo?: string; ktp?: string }>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    return () => {
      if (photo.objectUrl) {
        URL.revokeObjectURL(photo.objectUrl);
      }
      if (ktp.objectUrl) {
        URL.revokeObjectURL(ktp.objectUrl);
      }
    };
  }, [photo.objectUrl, ktp.objectUrl]);

  function applyFile(
    kind: "photo" | "ktp",
    file: File | undefined,
    setter: typeof setPhoto,
  ) {
    setStatus("idle");
    if (!file) {
      return;
    }

    const error = validateProfileImage(file);
    setErrors((current) => ({ ...current, [kind]: error ?? undefined }));
    if (error) {
      return;
    }

    setter((current) => {
      if (current.objectUrl) {
        URL.revokeObjectURL(current.objectUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      return { src: objectUrl, fileName: file.name, objectUrl };
    });
  }

  function handleSave() {
    if (errors.photo || errors.ktp) {
      return;
    }
    setStatus("saved");
  }

  return (
    <section id="dokumen" className="scroll-mt-24" aria-labelledby="dokumen-heading">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 id="dokumen-heading" className="text-xl font-semibold">
              Foto diri dan KTP
            </h2>
          </CardTitle>
          <CardDescription>
            Unggah gambar JPG, PNG, atau WebP maksimal 2 MB. Pratinjau muncul
            sebelum disimpan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <UploadSlot
              id={`${formId}-photo`}
              label="Foto diri"
              emptyLabel="Foto diri belum diunggah"
              previewAlt={`Pratinjau foto diri ${profile.fullName}`}
              preview={photo}
              error={errors.photo}
              initials={initialsFromName(profile.fullName)}
              circular
              onFileChange={(file) => applyFile("photo", file, setPhoto)}
            />
            <UploadSlot
              id={`${formId}-ktp`}
              label="Foto KTP"
              emptyLabel="Foto KTP belum diunggah"
              previewAlt={`Pratinjau foto KTP ${profile.fullName}`}
              preview={ktp}
              error={errors.ktp}
              onFileChange={(file) => applyFile("ktp", file, setKtp)}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleSave}
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 px-4",
              })}
            >
              Simpan dokumen
            </button>
            <p role="status" aria-live="polite" className="text-foreground text-sm">
              {status === "saved"
                ? "Pratinjau dokumen disimpan (simulasi, belum ke server)."
                : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function UploadSlot({
  id,
  label,
  emptyLabel,
  previewAlt,
  preview,
  error,
  initials,
  circular = false,
  onFileChange,
}: {
  id: string;
  label: string;
  emptyLabel: string;
  previewAlt: string;
  preview: PreviewState;
  error?: string;
  initials?: string;
  circular?: boolean;
  onFileChange: (file: File | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{label}</Label>
      <div className="border-border overflow-hidden rounded-xl border">
        <div className="bg-muted/40 flex min-h-44 items-center justify-center p-4">
          {preview.src ? (
            // Pratinjau blob lokal; img biasa agar URL objek tidak ditolak Next Image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.src}
              alt={previewAlt}
              className={
                circular
                  ? "size-28 rounded-full object-cover"
                  : "max-h-44 w-full object-contain"
              }
            />
          ) : circular && initials ? (
            <div
              aria-hidden="true"
              className="bg-secondary text-secondary-foreground flex size-28 items-center justify-center rounded-full text-xl font-semibold"
            >
              {initials}
            </div>
          ) : (
            <p className="text-muted-foreground flex flex-col items-center gap-2 text-sm">
              <FileImage aria-hidden="true" className="size-8" />
              {emptyLabel}
            </p>
          )}
        </div>
        {preview.fileName ? (
          <p className="text-muted-foreground border-border border-t px-3 py-2 text-sm">
            {preview.fileName}
          </p>
        ) : null}
      </div>
      <input
        id={id}
        name={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
        onChange={(event) => onFileChange(event.target.files?.[0])}
        className="text-foreground file:bg-secondary file:text-secondary-foreground min-h-11 w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-2"
      />
      <p id={`${id}-hint`} className="text-muted-foreground text-sm">
        JPG, PNG, atau WebP. Maksimal {MAX_IMAGE_BYTES / (1024 * 1024)} MB.
      </p>
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
