export type ExperienceInput = {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type ExperienceErrors = Partial<
  Record<keyof ExperienceInput, string>
>;

export function parseExperienceBody(body: unknown): ExperienceInput {
  const source = body && typeof body === "object" ? body : {};
  const record = source as Record<string, unknown>;
  return {
    companyName:
      typeof record.companyName === "string" ? record.companyName : "",
    position: typeof record.position === "string" ? record.position : "",
    startDate: typeof record.startDate === "string" ? record.startDate : "",
    endDate: typeof record.endDate === "string" ? record.endDate : "",
    current: Boolean(record.current),
    description:
      typeof record.description === "string" ? record.description : "",
  };
}

export function validateExperienceInput(
  values: ExperienceInput,
): ExperienceErrors {
  const errors: ExperienceErrors = {};

  if (!values.companyName.trim()) {
    errors.companyName = "Nama perusahaan wajib diisi.";
  }
  if (!values.position.trim()) {
    errors.position = "Jabatan wajib diisi.";
  }
  if (!values.startDate) {
    errors.startDate = "Tanggal mulai wajib diisi.";
  } else if (!isIsoDate(values.startDate)) {
    errors.startDate = "Tanggal mulai tidak valid.";
  }

  if (!values.current && !values.endDate) {
    errors.endDate = "Isi tanggal selesai atau tandai masih bekerja.";
  } else if (values.endDate && !values.current && !isIsoDate(values.endDate)) {
    errors.endDate = "Tanggal selesai tidak valid.";
  }

  if (
    values.startDate &&
    values.endDate &&
    !values.current &&
    values.endDate < values.startDate
  ) {
    errors.endDate = "Tanggal selesai tidak boleh sebelum tanggal mulai.";
  }

  if (!values.description.trim()) {
    errors.description = "Deskripsi pekerjaan wajib diisi.";
  }

  return errors;
}

export function experienceEndDate(values: ExperienceInput): string | null {
  return values.current ? null : values.endDate;
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
