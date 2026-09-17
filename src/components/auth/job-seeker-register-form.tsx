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
import { registerJobSeeker } from "@/lib/api/auth";
import {
  EMPTY_REGISTER_SEEKER_VALUES,
  firstRegisterSeekerErrorField,
  REGISTER_DISABILITY_OPTIONS,
  validateRegisterSeekerForm,
  type RegisterSeekerCertificationDraft,
  type RegisterSeekerExperienceDraft,
  type RegisterSeekerFormErrors,
  type RegisterSeekerFormValues,
  type RegisterSeekerSkillDraft,
} from "@/lib/auth/register-seeker";
import { emptyExperienceForm } from "@/lib/profile/experience";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  validateProfileImage,
} from "@/lib/profile/documents";
import {
  SKILL_LEVEL_LABEL,
  type JobSeekerDisabilityType,
  type SkillLevel,
} from "@/lib/types/job-seeker";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

const SKILL_LEVELS = Object.keys(SKILL_LEVEL_LABEL) as SkillLevel[];

export function JobSeekerRegisterForm() {
  const formId = useId();
  const [values, setValues] = useState<RegisterSeekerFormValues>(
    EMPTY_REGISTER_SEEKER_VALUES,
  );
  const [skills, setSkills] = useState<RegisterSeekerSkillDraft[]>([]);
  const [certifications, setCertifications] = useState<
    RegisterSeekerCertificationDraft[]
  >([]);
  const [experiences, setExperiences] = useState<
    RegisterSeekerExperienceDraft[]
  >([]);
  const [errors, setErrors] = useState<RegisterSeekerFormErrors>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("menengah");
  const [certificationName, setCertificationName] = useState("");
  const [certificationIssuer, setCertificationIssuer] = useState("");
  const [certificationYear, setCertificationYear] = useState("");

  function update<K extends keyof RegisterSeekerFormValues>(
    field: K,
    value: RegisterSeekerFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("idle");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleImage(
    field: "photoName" | "ktpName",
    file: File | undefined,
  ) {
    setStatus("idle");
    if (!file) {
      return;
    }
    const imageError = validateProfileImage(file);
    if (imageError) {
      setErrors((current) => ({ ...current, [field]: imageError }));
      return;
    }
    update(field, file.name);
  }

  function addSkill() {
    const name = skillName.trim();
    if (!name) {
      setErrors((current) => ({
        ...current,
        skills: "Nama keahlian wajib diisi sebelum ditambahkan.",
      }));
      document.getElementById(`${formId}-skillName`)?.focus();
      return;
    }
    const duplicate = skills.some(
      (skill) => skill.skillName.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      setErrors((current) => ({
        ...current,
        skills: "Keahlian ini sudah ada dalam daftar.",
      }));
      return;
    }
    setSkills((current) => [
      ...current,
      { id: `sk-${crypto.randomUUID()}`, skillName: name, level: skillLevel },
    ]);
    setSkillName("");
    setSkillLevel("menengah");
    setErrors((current) => ({ ...current, skills: undefined }));
  }

  function addCertification() {
    const name = certificationName.trim();
    if (!name) {
      setErrors((current) => ({
        ...current,
        certifications: "Nama sertifikasi wajib diisi sebelum ditambahkan.",
      }));
      document.getElementById(`${formId}-certificationName`)?.focus();
      return;
    }
    const duplicate = certifications.some(
      (certification) =>
        certification.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      setErrors((current) => ({
        ...current,
        certifications: "Sertifikasi ini sudah ada dalam daftar.",
      }));
      return;
    }
    const year = certificationYear.trim();
    if (year) {
      const yearNumber = Number(year);
      const currentYear = new Date().getFullYear();
      if (
        !Number.isInteger(yearNumber) ||
        yearNumber < 1950 ||
        yearNumber > currentYear + 1
      ) {
        setErrors((current) => ({
          ...current,
          certifications:
            "Tahun sertifikasi harus antara 1950 dan tahun depan.",
        }));
        document.getElementById(`${formId}-certificationYear`)?.focus();
        return;
      }
    }
    setCertifications((current) => [
      ...current,
      {
        id: `ct-${crypto.randomUUID()}`,
        name,
        issuer: certificationIssuer.trim(),
        year,
      },
    ]);
    setCertificationName("");
    setCertificationIssuer("");
    setCertificationYear("");
    setErrors((current) => ({ ...current, certifications: undefined }));
  }

  function addExperience() {
    const blank = emptyExperienceForm();
    setExperiences((current) => [
      ...current,
      { id: `ex-${crypto.randomUUID()}`, ...blank },
    ]);
    setErrors((current) => ({ ...current, experiences: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegisterSeekerForm(
      values,
      skills,
      certifications,
      experiences,
    );
    setErrors(nextErrors);

    const firstField = firstRegisterSeekerErrorField(nextErrors);
    if (firstField) {
      const focusId =
        firstField === "skills"
          ? `${formId}-skillName`
          : firstField === "certifications"
            ? `${formId}-certificationName`
            : firstField === "experiences" && experiences[0]
              ? `${formId}-exp-${experiences[0].id}-companyName`
              : `${formId}-${firstField}`;
      document.getElementById(focusId)?.focus();
      return;
    }

    const result = await registerJobSeeker({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password,
      phone: values.phone.trim(),
      address: values.address.trim(),
      disabilityType: values.disabilityType as JobSeekerDisabilityType,
      disabilityNotes: values.disabilityNotes.trim(),
      photoFileName: values.photoName,
      ktpFileName: values.ktpName,
      skills: skills.map(({ skillName: name, level }) => ({
        skillName: name,
        level,
      })),
      certifications: certifications.map(({ name, issuer, year }) => ({
        name,
        issuer,
        year,
      })),
      experiences: experiences.map((experience) => ({
        companyName: experience.companyName.trim(),
        position: experience.position.trim(),
        startDate: experience.startDate,
        endDate: experience.current ? null : experience.endDate,
        description: experience.description.trim(),
      })),
    });
    if ("error" in result) {
      setErrors((current) => ({
        ...current,
        email: result.errors?.email ?? result.error,
      }));
      document.getElementById(`${formId}-email`)?.focus();
      return;
    }
    setStatus("saved");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          <h2 className="text-xl font-semibold">Data pendaftaran</h2>
        </CardTitle>
        <CardDescription>
          Email dan kata sandi dipakai untuk masuk. Admin yang akan menyalurkan
          profil; jangan mengirim lamaran langsung ke perusahaan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-4">
            <legend className="text-foreground mb-1 text-base font-semibold">
              Identitas diri
            </legend>
            <Field
              id={`${formId}-fullName`}
              label="Nama lengkap"
              error={errors.fullName}
            >
              <Input
                id={`${formId}-fullName`}
                name="fullName"
                autoComplete="name"
                required
                aria-required="true"
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={
                  errors.fullName ? `${formId}-fullName-error` : undefined
                }
                value={values.fullName}
                onChange={(event) => update("fullName", event.target.value)}
                className="min-h-11"
              />
            </Field>
            <Field id={`${formId}-email`} label="Email" error={errors.email}>
              <Input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={
                  errors.email ? `${formId}-email-error` : undefined
                }
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                className="min-h-11"
              />
            </Field>
            <Field
              id={`${formId}-phone`}
              label="Nomor telepon"
              error={errors.phone}
            >
              <Input
                id={`${formId}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                aria-required="true"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={
                  errors.phone ? `${formId}-phone-error` : undefined
                }
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
                className="min-h-11"
              />
            </Field>
            <Field
              id={`${formId}-address`}
              label="Alamat"
              error={errors.address}
            >
              <Input
                id={`${formId}-address`}
                name="address"
                autoComplete="street-address"
                required
                aria-required="true"
                aria-invalid={errors.address ? true : undefined}
                aria-describedby={
                  errors.address ? `${formId}-address-error` : undefined
                }
                value={values.address}
                onChange={(event) => update("address", event.target.value)}
                className="min-h-11"
              />
            </Field>
            <Field
              id={`${formId}-disabilityType`}
              label="Jenis disabilitas"
              error={errors.disabilityType}
            >
              <select
                id={`${formId}-disabilityType`}
                name="disabilityType"
                required
                aria-required="true"
                aria-invalid={errors.disabilityType ? true : undefined}
                aria-describedby={
                  errors.disabilityType
                    ? `${formId}-disabilityType-error`
                    : undefined
                }
                value={values.disabilityType}
                onChange={(event) =>
                  update(
                    "disabilityType",
                    event.target.value as JobSeekerDisabilityType | "",
                  )
                }
                className={fieldClassName}
              >
                <option value="">Pilih jenis disabilitas</option>
                {REGISTER_DISABILITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              id={`${formId}-disabilityNotes`}
              label="Keterangan disabilitas"
              error={errors.disabilityNotes}
            >
              <textarea
                id={`${formId}-disabilityNotes`}
                name="disabilityNotes"
                rows={4}
                required
                aria-required="true"
                aria-invalid={errors.disabilityNotes ? true : undefined}
                aria-describedby={
                  errors.disabilityNotes
                    ? `${formId}-disabilityNotes-error`
                    : `${formId}-disabilityNotes-hint`
                }
                value={values.disabilityNotes}
                onChange={(event) =>
                  update("disabilityNotes", event.target.value)
                }
                className={`${fieldClassName} py-2`}
                placeholder="Contoh: tuli sejak lahir, nyaman komunikasi tertulis, butuh subtitle pada rapat video."
              />
              <p
                id={`${formId}-disabilityNotes-hint`}
                className="text-muted-foreground text-sm"
              >
                Jelaskan kondisi dan akomodasi yang membantu agar admin dapat
                menyalurkan dengan tepat.
              </p>
            </Field>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-foreground mb-1 text-base font-semibold">
              Kredensial masuk
            </legend>
            <Field
              id={`${formId}-password`}
              label="Kata sandi"
              error={errors.password}
            >
              <Input
                id={`${formId}-password`}
                name="password"
                type="password"
                autoComplete="new-password"
                required
                aria-required="true"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? `${formId}-password-error` : undefined
                }
                value={values.password}
                onChange={(event) => update("password", event.target.value)}
                className="min-h-11"
              />
            </Field>
            <Field
              id={`${formId}-passwordConfirm`}
              label="Ulangi kata sandi"
              error={errors.passwordConfirm}
            >
              <Input
                id={`${formId}-passwordConfirm`}
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                aria-required="true"
                aria-invalid={errors.passwordConfirm ? true : undefined}
                aria-describedby={
                  errors.passwordConfirm
                    ? `${formId}-passwordConfirm-error`
                    : undefined
                }
                value={values.passwordConfirm}
                onChange={(event) =>
                  update("passwordConfirm", event.target.value)
                }
                className="min-h-11"
              />
            </Field>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-foreground mb-1 text-base font-semibold">
              Foto diri dan KTP
            </legend>
            <Field
              id={`${formId}-photoName`}
              label="Foto diri"
              error={errors.photoName}
            >
              <input
                id={`${formId}-photoName`}
                name="photo"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                required
                aria-required="true"
                aria-invalid={errors.photoName ? true : undefined}
                aria-describedby={
                  errors.photoName ? `${formId}-photoName-error` : undefined
                }
                onChange={(event) =>
                  handleImage("photoName", event.target.files?.[0])
                }
                className="border-input bg-background min-h-11 w-full rounded-lg border px-3 py-2 text-sm"
              />
              <p className="text-muted-foreground text-sm">
                JPG, PNG, atau WebP. Maksimal {MAX_IMAGE_BYTES / (1024 * 1024)}{" "}
                MB.
                {values.photoName ? ` Berkas: ${values.photoName}` : ""}
              </p>
            </Field>
            <Field
              id={`${formId}-ktpName`}
              label="Foto KTP"
              error={errors.ktpName}
            >
              <input
                id={`${formId}-ktpName`}
                name="ktp"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                required
                aria-required="true"
                aria-invalid={errors.ktpName ? true : undefined}
                aria-describedby={
                  errors.ktpName ? `${formId}-ktpName-error` : undefined
                }
                onChange={(event) =>
                  handleImage("ktpName", event.target.files?.[0])
                }
                className="border-input bg-background min-h-11 w-full rounded-lg border px-3 py-2 text-sm"
              />
              <p className="text-muted-foreground text-sm">
                JPG, PNG, atau WebP. Maksimal {MAX_IMAGE_BYTES / (1024 * 1024)}{" "}
                MB.
                {values.ktpName ? ` Berkas: ${values.ktpName}` : ""}
              </p>
            </Field>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-foreground mb-1 text-base font-semibold">
              Keahlian (opsional)
            </legend>
            {skills.length > 0 ? (
              <ul className="flex flex-col gap-2 p-0">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="text-foreground text-sm">
                      {skill.skillName} ({SKILL_LEVEL_LABEL[skill.level]})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSkills((current) =>
                          current.filter((item) => item.id !== skill.id),
                        )
                      }
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "min-h-11 px-4",
                      })}
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                Boleh dikosongkan. Keahlian bisa dilengkapi lagi setelah masuk.
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field
                id={`${formId}-skillName`}
                label="Nama keahlian"
                required={false}
              >
                <Input
                  id={`${formId}-skillName`}
                  name="skillName"
                  value={skillName}
                  onChange={(event) => setSkillName(event.target.value)}
                  className="min-h-11"
                />
              </Field>
              <Field
                id={`${formId}-skillLevel`}
                label="Tingkat"
                required={false}
              >
                <select
                  id={`${formId}-skillLevel`}
                  value={skillLevel}
                  onChange={(event) =>
                    setSkillLevel(event.target.value as SkillLevel)
                  }
                  className={fieldClassName}
                >
                  {SKILL_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {SKILL_LEVEL_LABEL[level]}
                    </option>
                  ))}
                </select>
              </Field>
              <button
                type="button"
                onClick={addSkill}
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "min-h-11 px-4",
                })}
              >
                Tambah keahlian
              </button>
            </div>
            {errors.skills ? (
              <p
                id={`${formId}-skills-error`}
                className="text-destructive text-sm"
                role="alert"
              >
                {errors.skills}
              </p>
            ) : null}
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-foreground mb-1 text-base font-semibold">
              Sertifikasi (opsional)
            </legend>
            {certifications.length > 0 ? (
              <ul className="flex flex-col gap-2 p-0">
                {certifications.map((certification) => (
                  <li
                    key={certification.id}
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="text-foreground text-sm">
                      {certification.name}
                      {certification.issuer
                        ? ` · ${certification.issuer}`
                        : ""}
                      {certification.year ? ` (${certification.year})` : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCertifications((current) =>
                          current.filter(
                            (item) => item.id !== certification.id,
                          ),
                        )
                      }
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "min-h-11 px-4",
                      })}
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                Boleh dikosongkan. Sertifikasi bisa dilengkapi lagi setelah
                masuk.
              </p>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field
                id={`${formId}-certificationName`}
                label="Nama sertifikasi"
                required={false}
              >
                <Input
                  id={`${formId}-certificationName`}
                  name="certificationName"
                  value={certificationName}
                  onChange={(event) =>
                    setCertificationName(event.target.value)
                  }
                  className="min-h-11"
                />
              </Field>
              <Field
                id={`${formId}-certificationIssuer`}
                label="Penerbit"
                required={false}
              >
                <Input
                  id={`${formId}-certificationIssuer`}
                  name="certificationIssuer"
                  value={certificationIssuer}
                  onChange={(event) =>
                    setCertificationIssuer(event.target.value)
                  }
                  className="min-h-11"
                />
              </Field>
              <Field
                id={`${formId}-certificationYear`}
                label="Tahun"
                required={false}
              >
                <Input
                  id={`${formId}-certificationYear`}
                  name="certificationYear"
                  inputMode="numeric"
                  placeholder="Contoh: 2024"
                  value={certificationYear}
                  onChange={(event) => setCertificationYear(event.target.value)}
                  className="min-h-11"
                />
              </Field>
            </div>
            <button
              type="button"
              onClick={addCertification}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "min-h-11 px-4 self-start",
              })}
            >
              Tambah sertifikasi
            </button>
            {errors.certifications ? (
              <p
                id={`${formId}-certifications-error`}
                className="text-destructive text-sm"
                role="alert"
              >
                {errors.certifications}
              </p>
            ) : null}
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="text-foreground mb-1 text-base font-semibold">
              Pengalaman kerja (opsional)
            </legend>
            {experiences.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Boleh dikosongkan jika belum ada pengalaman kerja.
              </p>
            ) : null}
            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className="border-border flex flex-col gap-3 rounded-xl border p-4"
              >
                <p className="text-foreground text-sm font-medium">
                  Pengalaman {index + 1}
                </p>
                <Field
                  id={`${formId}-exp-${experience.id}-companyName`}
                  label="Nama perusahaan"
                  required={false}
                >
                  <Input
                    id={`${formId}-exp-${experience.id}-companyName`}
                    value={experience.companyName}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item) =>
                          item.id === experience.id
                            ? { ...item, companyName: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="min-h-11"
                  />
                </Field>
                <Field
                  id={`${formId}-exp-${experience.id}-position`}
                  label="Jabatan"
                  required={false}
                >
                  <Input
                    id={`${formId}-exp-${experience.id}-position`}
                    value={experience.position}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item) =>
                          item.id === experience.id
                            ? { ...item, position: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="min-h-11"
                  />
                </Field>
                <Field
                  id={`${formId}-exp-${experience.id}-startDate`}
                  label="Tanggal mulai"
                  required={false}
                >
                  <Input
                    id={`${formId}-exp-${experience.id}-startDate`}
                    type="date"
                    value={experience.startDate}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item) =>
                          item.id === experience.id
                            ? { ...item, startDate: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="min-h-11"
                  />
                </Field>
                <div className="flex items-center gap-2">
                  <input
                    id={`${formId}-exp-${experience.id}-current`}
                    type="checkbox"
                    checked={experience.current}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item) =>
                          item.id === experience.id
                            ? { ...item, current: event.target.checked }
                            : item,
                        ),
                      )
                    }
                    className="size-4"
                  />
                  <Label htmlFor={`${formId}-exp-${experience.id}-current`}>
                    Saya masih bekerja di sini
                  </Label>
                </div>
                {experience.current ? null : (
                  <Field
                    id={`${formId}-exp-${experience.id}-endDate`}
                    label="Tanggal selesai"
                    required={false}
                  >
                    <Input
                      id={`${formId}-exp-${experience.id}-endDate`}
                      type="date"
                      value={experience.endDate}
                      onChange={(event) =>
                        setExperiences((current) =>
                          current.map((item) =>
                            item.id === experience.id
                              ? { ...item, endDate: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className="min-h-11"
                    />
                  </Field>
                )}
                <Field
                  id={`${formId}-exp-${experience.id}-description`}
                  label="Deskripsi pekerjaan"
                  required={false}
                >
                  <textarea
                    id={`${formId}-exp-${experience.id}-description`}
                    rows={3}
                    value={experience.description}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item) =>
                          item.id === experience.id
                            ? { ...item, description: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className={`${fieldClassName} py-2`}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() =>
                    setExperiences((current) =>
                      current.filter((item) => item.id !== experience.id),
                    )
                  }
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "min-h-11 px-4",
                  })}
                >
                  Hapus pengalaman
                </button>
              </div>
            ))}
            <button
              id={`${formId}-experiences`}
              type="button"
              onClick={addExperience}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "min-h-11 px-4 self-start",
              })}
            >
              Tambah pengalaman
            </button>
            {errors.experiences ? (
              <p
                id={`${formId}-experiences-error`}
                className="text-destructive text-sm"
                role="alert"
              >
                {errors.experiences}
              </p>
            ) : null}
          </fieldset>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 px-4",
              })}
            >
              Daftar sebagai pencari kerja
            </button>
            <p
              role="status"
              aria-live="polite"
              className="text-foreground text-sm"
            >
              {status === "saved" ? (
                <>
                  Pendaftaran berhasil.{" "}
                  <Link
                    href="/masuk"
                    className="text-primary font-medium underline underline-offset-4"
                  >
                    Lanjut ke halaman masuk
                  </Link>
                </>
              ) : (
                ""
              )}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  error,
  required = true,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Label htmlFor={id} className="text-sm">
        {label}{" "}
        {required ? (
          <>
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
            <span className="sr-only"> (wajib)</span>
          </>
        ) : (
          <span className="text-muted-foreground font-normal"> (opsional)</span>
        )}
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
