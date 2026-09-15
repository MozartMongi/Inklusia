export type ExperienceFormValues = {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type ExperienceFormErrors = Partial<
  Record<keyof ExperienceFormValues, string>
>;

export function emptyExperienceForm(): ExperienceFormValues {
  return {
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export function validateExperienceForm(
  values: ExperienceFormValues,
): ExperienceFormErrors {
  const errors: ExperienceFormErrors = {};

  if (!values.companyName.trim()) {
    errors.companyName = "Nama perusahaan wajib diisi.";
  }

  if (!values.position.trim()) {
    errors.position = "Jabatan wajib diisi.";
  }

  if (!values.startDate) {
    errors.startDate = "Tanggal mulai wajib diisi.";
  }

  if (!values.current && !values.endDate) {
    errors.endDate = "Isi tanggal selesai atau tandai masih bekerja.";
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

export function firstExperienceErrorField(
  errors: ExperienceFormErrors,
): keyof ExperienceFormValues | null {
  const order: (keyof ExperienceFormValues)[] = [
    "companyName",
    "position",
    "startDate",
    "endDate",
    "description",
  ];
  return order.find((field) => errors[field]) ?? null;
}
