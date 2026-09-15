import type { ContactChannel } from "@/lib/types/placement";

export type ContactFormValues = {
  channel: ContactChannel | "";
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.channel) {
    errors.channel = "Pilih saluran kontak.";
  }

  if (!values.message.trim()) {
    errors.message = "Catatan kontak wajib diisi.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Tuliskan minimal 10 karakter tentang kontak ini.";
  } else if (values.message.trim().length > 500) {
    errors.message = "Catatan maksimal 500 karakter.";
  }

  return errors;
}

export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `tel:+62${digits.slice(1)}`;
  }
  return `tel:+${digits}`;
}

export function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${international}`;
}
