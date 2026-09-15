import { getCvPreviewGaps } from "@/lib/cv/gaps";
import {
  CV_PREVIEW_ARTICLE_CLASS,
  CV_PREVIEW_NAME_CLASS,
  CV_PREVIEW_SECTION_HEADING_CLASS,
} from "@/lib/cv/preview-styles";
import {
  formatExperiencePeriod,
  initialsFromName,
} from "@/lib/profile/format";
import type { GeneratedCv } from "@/lib/types/cv";
import {
  JOB_SEEKER_DISABILITY_LABEL,
  SKILL_LEVEL_LABEL,
} from "@/lib/types/job-seeker";
import Image from "next/image";
import Link from "next/link";

type CvPreviewProps = {
  cv: GeneratedCv;
};

function EmptySection({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <p
      role="status"
      className="border-border bg-muted/50 text-muted-foreground rounded-lg border border-dashed px-3 py-3 text-sm leading-6"
    >
      {label} masih kosong.{" "}
      <Link
        href={href}
        className="text-primary font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
      >
        Lengkapi {label.toLowerCase()}
      </Link>
    </p>
  );
}

export function CvPreview({ cv }: CvPreviewProps) {
  const gaps = getCvPreviewGaps(cv);

  return (
    <article
      data-cv-template="profesional"
      aria-label={`Pratinjau CV ${cv.fullName}`}
      className={CV_PREVIEW_ARTICLE_CLASS}
    >
      {gaps.length > 0 ? (
        <p className="text-muted-foreground mb-4 text-sm" aria-live="polite">
          {gaps.length} bagian profil masih kosong di pratinjau ini.
        </p>
      ) : null}

      <header className="border-border mb-6 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start">
        <PreviewPhoto name={cv.fullName} photoUrl={cv.photoUrl} />
        <div className="min-w-0 flex-1">
          <h3 className={CV_PREVIEW_NAME_CLASS}>{cv.fullName}</h3>
          <p className="text-muted-foreground mt-2 text-base leading-7">
            {cv.email} · {cv.phone}
          </p>
          <p className="text-foreground mt-1 text-base leading-7">
            {cv.address}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {JOB_SEEKER_DISABILITY_LABEL[cv.disabilityType]}
          </p>
        </div>
      </header>

      <section aria-labelledby="pratinjau-ringkasan" className="mb-6">
        <h4 id="pratinjau-ringkasan" className={CV_PREVIEW_SECTION_HEADING_CLASS}>
          Ringkasan
        </h4>
        {cv.bio.trim() ? (
          <p className="text-foreground text-base leading-7">{cv.bio}</p>
        ) : (
          <EmptySection label="Ringkasan" href="/profil#data-diri" />
        )}
      </section>

      <section aria-labelledby="pratinjau-keahlian" className="mb-6">
        <h4 id="pratinjau-keahlian" className={CV_PREVIEW_SECTION_HEADING_CLASS}>
          Keahlian
        </h4>
        {cv.skills.length === 0 ? (
          <EmptySection label="Keahlian" href="/profil#keahlian" />
        ) : (
          <ul className="m-0 list-disc space-y-1 ps-5">
            {cv.skills.map((skill) => (
              <li key={skill.id} className="text-foreground text-base leading-7">
                {skill.skillName} ({SKILL_LEVEL_LABEL[skill.level]})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="pratinjau-pengalaman">
        <h4
          id="pratinjau-pengalaman"
          className={CV_PREVIEW_SECTION_HEADING_CLASS}
        >
          Pengalaman kerja
        </h4>
        {cv.experiences.length === 0 ? (
          <EmptySection label="Pengalaman kerja" href="/profil#pengalaman" />
        ) : (
          <ul className="m-0 flex list-none flex-col gap-5 p-0">
            {cv.experiences.map((experience) => (
              <li key={experience.id}>
                <p className="text-foreground text-base font-semibold">
                  {experience.position}
                </p>
                <p className="text-muted-foreground text-sm leading-6">
                  {experience.companyName} ·{" "}
                  {formatExperiencePeriod(
                    experience.startDate,
                    experience.endDate,
                  )}
                </p>
                <p className="text-foreground mt-2 text-base leading-7">
                  {experience.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

function PreviewPhoto({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={`Foto diri ${name}`}
        width={80}
        height={80}
        className="size-20 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        aria-hidden="true"
        className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-full text-xl font-semibold"
      >
        {initialsFromName(name)}
      </div>
      <EmptySection label="Foto diri" href="/profil#dokumen" />
    </div>
  );
}
