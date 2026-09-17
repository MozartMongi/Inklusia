export const CONTACT_CHANNELS = ["telepon", "email", "whatsapp"] as const;

export type ContactChannel = (typeof CONTACT_CHANNELS)[number];

export const CONTACT_CHANNEL_LABEL: Record<ContactChannel, string> = {
  telepon: "Telepon",
  email: "Email",
  whatsapp: "WhatsApp",
};

export const CONTACT_CHANNEL_OPTIONS = CONTACT_CHANNELS.map((value) => ({
  value,
  label: CONTACT_CHANNEL_LABEL[value],
}));

export const CONTACT_LOG_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_LOG_MESSAGE_MAX_LENGTH = 500;

export type PlacementContactLogRow = {
  id: string;
  job_seeker_profile_id: string;
  channel: ContactChannel;
  message: string;
  created_by_user_id: string | null;
  created_at: Date;
};
