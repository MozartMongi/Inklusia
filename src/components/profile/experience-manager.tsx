"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addJobSeekerExperience, deleteJobSeekerExperience } from "@/lib/api/job-seeker";
import {
  emptyExperienceForm,
  firstExperienceErrorField,
  validateExperienceForm,
  type ExperienceFormErrors,
  type ExperienceFormValues,
} from "@/lib/profile/experience";
import { formatExperiencePeriod } from "@/lib/profile/format";
import type { JobSeekerProfile, WorkExperience } from "@/lib/types/job-seeker";
import { useId, useState, type FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type ExperienceManagerProps = {
  profile: JobSeekerProfile;
};

export function ExperienceManager({ profile }: ExperienceManagerProps) {
  const formId = useId();
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    profile.experiences,
  );
  const [values, setValues] = useState<ExperienceFormValues>(
    emptyExperienceForm(),
  );
  const [errors, setErrors] = useState<ExperienceFormErrors>({});
  const [status, setStatus] = useState("");

  function update<K extends keyof ExperienceFormValues>(
    field: K,
    value: ExperienceFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateExperienceForm(values);
    setErrors(nextErrors);

    const firstField = firstExperienceErrorField(nextErrors);
    if (firstField) {
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    const result = await addJobSeekerExperience({
      companyName: values.companyName.trim(),
      position: values.position.trim(),
      startDate: values.startDate,
      endDate: values.current ? null : values.endDate,
      current: values.current,
      description: values.description.trim(),
    });
    if ("error" in result) {
      setErrors({ companyName: result.error });
      return;
    }

    setExperiences(result.data.experiences);
    setValues(emptyExperienceForm());
    setErrors({});
    setStatus(`${values.position.trim()} ditambahkan.`);
  }

  async function handleRemove(experience: WorkExperience) {
    const result = await deleteJobSeekerExperience(experience.id);
    if ("error" in result) {
      setStatus(result.error);
      return;
    }
    setExperiences(result.data.experiences);
    setStatus(`${experience.position} dihapus.`);
  }

  return (
    <section
      id="pengalaman"
      className="scroll-mt-24"
      aria-labelledby="pengalaman-heading"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 id="pengalaman-heading" className="text-xl font-semibold">
              Pengalaman kerja
            </h2>
          </CardTitle>
          <CardDescription>
            Tambah atau hapus riwayat pekerjaan agar admin menilai kecocokan
            lowongan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {experiences.length === 0 ? (
            <p className="text-muted-foreground text-base">
              Belum ada pengalaman kerja yang dicantumkan.
            </p>
          ) : (
            <ol className="flex flex-col gap-4">
              {experiences.map((experience) => (
                <li
                  key={experience.id}
                  className="border-border rounded-lg border p-4"
                >
                  <p className="text-foreground text-base font-semibold">
                    {experience.position}
                  </p>
                  <p className="text-foreground mt-1 text-sm">
                    {experience.companyName}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {formatExperiencePeriod(
                      experience.startDate,
                      experience.endDate,
                    )}
                  </p>
                  <p className="text-foreground mt-3 text-base leading-7">
                    {experience.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemove(experience)}
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                      className: "mt-4 min-h-11 px-3",
                    })}
                  >
                    Hapus pengalaman
                  </button>
                </li>
              ))}
            </ol>
          )}

          <form
            onSubmit={handleAdd}
            noValidate
            className="border-border flex flex-col gap-3 rounded-xl border p-4"
            aria-label="Tambah pengalaman kerja"
          >
            <Field
              id={`${formId}-companyName`}
              label="Nama perusahaan"
              error={errors.companyName}
            >
              <Input
                id={`${formId}-companyName`}
                name="companyName"
                required
                aria-required="true"
                aria-invalid={errors.companyName ? true : undefined}
                aria-describedby={
                  errors.companyName
                    ? `${formId}-companyName-error`
                    : undefined
                }
                value={values.companyName}
                onChange={(event) => update("companyName", event.target.value)}
                className="min-h-11"
              />
            </Field>

            <Field
              id={`${formId}-position`}
              label="Jabatan"
              error={errors.position}
            >
              <Input
                id={`${formId}-position`}
                name="position"
                required
                aria-required="true"
                aria-invalid={errors.position ? true : undefined}
                aria-describedby={
                  errors.position ? `${formId}-position-error` : undefined
                }
                value={values.position}
                onChange={(event) => update("position", event.target.value)}
                className="min-h-11"
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                id={`${formId}-startDate`}
                label="Tanggal mulai"
                error={errors.startDate}
              >
                <Input
                  id={`${formId}-startDate`}
                  name="startDate"
                  type="date"
                  required
                  aria-required="true"
                  aria-invalid={errors.startDate ? true : undefined}
                  aria-describedby={
                    errors.startDate ? `${formId}-startDate-error` : undefined
                  }
                  value={values.startDate}
                  onChange={(event) => update("startDate", event.target.value)}
                  className="min-h-11"
                />
              </Field>

              <Field
                id={`${formId}-endDate`}
                label="Tanggal selesai"
                error={errors.endDate}
              >
                <Input
                  id={`${formId}-endDate`}
                  name="endDate"
                  type="date"
                  disabled={values.current}
                  aria-invalid={errors.endDate ? true : undefined}
                  aria-describedby={
                    errors.endDate ? `${formId}-endDate-error` : undefined
                  }
                  value={values.current ? "" : values.endDate}
                  onChange={(event) => update("endDate", event.target.value)}
                  className="min-h-11"
                />
              </Field>
            </div>

            <div className="flex items-center gap-2">
              <input
                id={`${formId}-current`}
                name="current"
                type="checkbox"
                checked={values.current}
                onChange={(event) => update("current", event.target.checked)}
                className="border-input size-4 rounded"
              />
              <Label htmlFor={`${formId}-current`} className="text-sm font-normal">
                Saya masih bekerja di sini
              </Label>
            </div>

            <Field
              id={`${formId}-description`}
              label="Deskripsi pekerjaan"
              error={errors.description}
            >
              <textarea
                id={`${formId}-description`}
                name="description"
                required
                aria-required="true"
                aria-invalid={errors.description ? true : undefined}
                aria-describedby={
                  errors.description
                    ? `${formId}-description-error`
                    : undefined
                }
                rows={3}
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                className={`${fieldClassName} py-2`}
              />
            </Field>

            <button
              type="submit"
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 w-fit px-4",
              })}
            >
              Tambah pengalaman
            </button>
          </form>

          <p role="status" aria-live="polite" className="text-foreground text-sm">
            {status}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
