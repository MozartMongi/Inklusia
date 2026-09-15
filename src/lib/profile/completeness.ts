import { validateIdentityForm } from "@/lib/profile/identity";
import type { JobSeekerProfile } from "@/lib/types/job-seeker";

export type ProfileSectionStatus = {
  href: string;
  label: string;
  complete: boolean;
};

export function getProfileSectionStatuses(
  profile: JobSeekerProfile,
): ProfileSectionStatus[] {
  const identityErrors = validateIdentityForm({
    fullName: profile.fullName,
    phone: profile.phone,
    address: profile.address,
    disabilityType: profile.disabilityType,
    bio: profile.bio,
  });
  const identityComplete = Object.keys(identityErrors).length === 0;

  return [
    {
      href: "#data-diri",
      label: "Data diri dan disabilitas",
      complete: identityComplete,
    },
    {
      href: "#dokumen",
      label: "Foto diri",
      complete: Boolean(profile.photoUrl),
    },
    {
      href: "#dokumen",
      label: "Foto KTP",
      complete: Boolean(profile.ktpPhotoUrl),
    },
    {
      href: "#keahlian",
      label: "Keahlian",
      complete: profile.skills.length > 0,
    },
    {
      href: "#pengalaman",
      label: "Pengalaman kerja",
      complete: profile.experiences.length > 0,
    },
  ];
}

export function getProfileCompleteness(profile: JobSeekerProfile) {
  const sections = getProfileSectionStatuses(profile);
  const completeCount = sections.filter((section) => section.complete).length;
  const percent = Math.round((completeCount / sections.length) * 100);

  return {
    percent,
    missing: sections.filter((section) => !section.complete),
  };
}
