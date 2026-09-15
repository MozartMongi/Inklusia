export type ForwardFormValues = {
  jobId: string;
  note: string;
};

export type ForwardFormErrors = Partial<Record<keyof ForwardFormValues, string>>;

export function validateForwardForm(values: ForwardFormValues): ForwardFormErrors {
  const errors: ForwardFormErrors = {};

  if (!values.jobId) {
    errors.jobId = "Pilih lowongan tujuan penyaluran.";
  }

  if (values.note.trim().length > 500) {
    errors.note = "Catatan maksimal 500 karakter.";
  }

  return errors;
}
