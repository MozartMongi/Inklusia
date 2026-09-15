import { isUuid } from "../db/ids.js";
import {
  CONTACT_CHANNELS,
  CONTACT_LOG_MESSAGE_MAX_LENGTH,
  CONTACT_LOG_MESSAGE_MIN_LENGTH,
  type ContactChannel,
} from "../db/contact-logs-schema.js";

export type ContactLogInput = {
  jobSeekerId: string;
  channel: ContactChannel | "";
  message: string;
};

export type ContactLogErrors = Partial<Record<keyof ContactLogInput, string>>;

function isContactChannel(value: string): value is ContactChannel {
  return CONTACT_CHANNELS.includes(value as ContactChannel);
}

export function parseContactLogBody(body: unknown): ContactLogInput {
  const source = body && typeof body === "object" ? body : {};
  const record = source as Record<string, unknown>;
  const channel =
    typeof record.channel === "string" ? record.channel.trim() : "";

  return {
    jobSeekerId:
      typeof record.jobSeekerId === "string" ? record.jobSeekerId.trim() : "",
    channel: isContactChannel(channel) ? channel : "",
    message: typeof record.message === "string" ? record.message : "",
  };
}

export function validateContactLogInput(values: ContactLogInput): ContactLogErrors {
  const errors: ContactLogErrors = {};
  const message = values.message.trim();

  if (!values.jobSeekerId) {
    errors.jobSeekerId = "Pilih pencari kerja yang akan dihubungi.";
  } else if (!isUuid(values.jobSeekerId)) {
    errors.jobSeekerId = "Pencari kerja tidak valid.";
  }

  if (!values.channel) {
    errors.channel = "Pilih saluran kontak.";
  }

  if (!message) {
    errors.message = "Catatan kontak wajib diisi.";
  } else if (message.length < CONTACT_LOG_MESSAGE_MIN_LENGTH) {
    errors.message = `Tuliskan minimal ${CONTACT_LOG_MESSAGE_MIN_LENGTH} karakter tentang kontak ini.`;
  } else if (message.length > CONTACT_LOG_MESSAGE_MAX_LENGTH) {
    errors.message = `Catatan maksimal ${CONTACT_LOG_MESSAGE_MAX_LENGTH} karakter.`;
  }

  return errors;
}
