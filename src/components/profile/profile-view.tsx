import { ProfileCompleteness } from "@/components/profile/profile-completeness";
import { DocumentsUpload } from "@/components/profile/documents-upload";
import { ExperienceManager } from "@/components/profile/experience-manager";
import { IdentityForm } from "@/components/profile/identity-form";
import { SkillsManager } from "@/components/profile/skills-manager";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { initialsFromName } from "@/lib/profile/format";
import { type JobSeekerProfile } from "@/lib/types/job-seeker";
import Image from "next/image";

type ProfileViewProps = {
  profile: JobSeekerProfile;
};

export function ProfileView({ profile }: ProfileViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <ProfileSummary profile={profile} />
      <IdentityForm profile={profile} />
      <DocumentsUpload profile={profile} />
      <SkillsManager profile={profile} />
      <ExperienceManager profile={profile} />
    </div>
  );
}

function ProfileSummary({ profile }: ProfileViewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ProfilePhoto name={profile.fullName} photoUrl={profile.photoUrl} />
        <div className="min-w-0 flex-1">
          <CardTitle className="text-foreground text-2xl font-semibold">
            {profile.fullName}
          </CardTitle>
          <CardDescription className="mt-1 text-base">
            {profile.email}
          </CardDescription>
          <ProfileCompleteness profile={profile} />
        </div>
      </CardHeader>
    </Card>
  );
}

function ProfilePhoto({
  name,
  photoUrl,
  size = "md",
}: {
  name: string;
  photoUrl: string | null;
  size?: "md" | "lg";
}) {
  const dimension = size === "lg" ? "size-28" : "size-20";

  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={`Foto diri ${name}`}
        width={size === "lg" ? 112 : 80}
        height={size === "lg" ? 112 : 80}
        className={`${dimension} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`bg-secondary text-secondary-foreground flex ${dimension} shrink-0 items-center justify-center rounded-full text-xl font-semibold`}
    >
      {initialsFromName(name)}
    </div>
  );
}
