import { PageActionLink } from "@/components/layout/page-action-link";
import { getProfileCompleteness } from "@/lib/profile/completeness";
import type { JobSeekerProfile } from "@/lib/types/job-seeker";

type ProfileCompletenessProps = {
  profile: JobSeekerProfile;
};

export function ProfileCompleteness({ profile }: ProfileCompletenessProps) {
  const { percent, missing } = getProfileCompleteness(profile);

  return (
    <div className="mt-3">
      <p className="text-muted-foreground text-sm">
        Kelengkapan profil {percent} persen. Lengkapi data agar admin lebih
        mudah menyalurkan Anda ke lowongan yang sesuai.
      </p>
      <div
        className="bg-muted mt-3 h-2.5 w-full max-w-sm overflow-hidden rounded-full"
        role="meter"
        aria-label="Kelengkapan profil"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent} persen`}
      >
        <div
          className="bg-primary h-full rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      {missing.length > 0 ? (
        <nav
          aria-label="Bagian profil yang masih kosong"
          className="mt-4"
        >
          <p className="text-foreground text-sm font-medium">
            Bagian yang masih perlu dilengkapi
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {missing.map((section) => (
              <li key={`${section.href}-${section.label}`}>
                <PageActionLink href={section.href}>
                  Lengkapi {section.label}
                </PageActionLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <p className="text-foreground mt-3 text-sm" role="status">
          Semua bagian profil sudah terisi.
        </p>
      )}
    </div>
  );
}
