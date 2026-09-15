import { validateIdentityInput } from "./identity.js";
import type { JobSeekerProfileDto } from "./profile-dto.js";

export type CompletenessSection = {
  id: "identity" | "photo" | "ktp" | "skills" | "experiences";
  label: string;
  complete: boolean;
};

export type ProfileCompleteness = {
  percent: number;
  missing: CompletenessSection[];
  sections: CompletenessSection[];
};

export function computeProfileCompleteness(
  profile: Pick<
    JobSeekerProfileDto,
    | "fullName"
    | "phone"
    | "address"
    | "disabilityType"
    | "bio"
    | "photoUrl"
    | "ktpPhotoUrl"
    | "skills"
    | "experiences"
  >,
): ProfileCompleteness {
  const identityErrors = validateIdentityInput({
    fullName: profile.fullName,
    phone: profile.phone,
    address: profile.address,
    disabilityType: profile.disabilityType,
    bio: profile.bio,
  });

  const sections: CompletenessSection[] = [
    {
      id: "identity",
      label: "Data diri dan disabilitas",
      complete: Object.keys(identityErrors).length === 0,
    },
    {
      id: "photo",
      label: "Foto diri",
      complete: Boolean(profile.photoUrl),
    },
    {
      id: "ktp",
      label: "Foto KTP",
      complete: Boolean(profile.ktpPhotoUrl),
    },
    {
      id: "skills",
      label: "Keahlian",
      complete: profile.skills.length > 0,
    },
    {
      id: "experiences",
      label: "Pengalaman kerja",
      complete: profile.experiences.length > 0,
    },
  ];

  const completeCount = sections.filter((section) => section.complete).length;
  const percent = Math.round((completeCount / sections.length) * 100);

  return {
    percent,
    missing: sections.filter((section) => !section.complete),
    sections,
  };
}
