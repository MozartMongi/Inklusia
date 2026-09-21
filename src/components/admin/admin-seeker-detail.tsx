import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatExperiencePeriod,
  initialsFromName,
} from "@/lib/profile/format";
import {
  JOB_SEEKER_DISABILITY_LABEL,
  SKILL_LEVEL_LABEL,
  type JobSeekerProfile,
} from "@/lib/types/job-seeker";
import Image from "next/image";

type AdminSeekerDetailProps = {
  profile: JobSeekerProfile;
};

export function AdminSeekerDetail({ profile }: AdminSeekerDetailProps) {
  return (
    <div className="flex flex-col gap-6">
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
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary">
                {JOB_SEEKER_DISABILITY_LABEL[profile.disabilityType]}
              </Badge>
              <Badge variant="outline">
                Kelengkapan {profile.profileCompleteness}%
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section aria-labelledby="identitas-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="identitas-heading" className="text-xl font-semibold">
                Identitas dan kontak
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Telepon" value={profile.phone} />
              <DetailItem label="Alamat" value={profile.address} />
              <DetailItem
                label="Jenis disabilitas"
                value={JOB_SEEKER_DISABILITY_LABEL[profile.disabilityType]}
              />
              <DetailItem
                label="Terakhir diperbarui"
                value={formatUpdatedAt(profile.updatedAt)}
              />
            </dl>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="keterangan-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="keterangan-heading" className="text-xl font-semibold">
                Keterangan disabilitas
              </h2>
            </CardTitle>
            <CardDescription>
              Informasi kondisi dan akomodasi untuk penyaluran.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-base leading-7">
              {(profile.disabilityNotes ?? "").trim()
                ? profile.disabilityNotes
                : "Belum ada keterangan disabilitas."}
            </p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="bio-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="bio-heading" className="text-xl font-semibold">
                Tentang pencari kerja
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-base leading-7">
              {(profile.bio ?? "").trim()
                ? profile.bio
                : "Belum ada ringkasan diri."}
            </p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="dokumen-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="dokumen-heading" className="text-xl font-semibold">
                Dokumen
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DocumentStatus
              label="Foto diri"
              present={Boolean(profile.photoUrl)}
            />
            <DocumentStatus
              label="Foto KTP"
              present={Boolean(profile.ktpPhotoUrl)}
            />
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="keahlian-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="keahlian-heading" className="text-xl font-semibold">
                Keahlian
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.skills.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Belum ada keahlian yang tercatat.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 p-0">
                {profile.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="border-border flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    <span className="text-foreground font-medium">
                      {skill.skillName}
                    </span>
                    <Badge variant="secondary">
                      {SKILL_LEVEL_LABEL[skill.level]}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="sertifikasi-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="sertifikasi-heading" className="text-xl font-semibold">
                Sertifikasi
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(profile.certifications ?? []).length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Belum ada sertifikasi yang tercatat.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 p-0">
                {(profile.certifications ?? []).map((certification) => (
                  <li
                    key={certification.id}
                    className="border-border rounded-lg border px-3 py-2 text-sm"
                  >
                    <p className="text-foreground font-medium">
                      {certification.name}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {[certification.issuer, certification.year]
                        .filter(Boolean)
                        .join(" · ") || "Penerbit belum diisi"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="pengalaman-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="pengalaman-heading" className="text-xl font-semibold">
                Pengalaman kerja
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.experiences.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Belum ada pengalaman kerja yang tercatat.
              </p>
            ) : (
              <ul className="flex flex-col gap-4 p-0">
                {profile.experiences.map((experience) => (
                  <li
                    key={experience.id}
                    className="border-border rounded-lg border px-4 py-3"
                  >
                    <p className="text-foreground font-semibold">
                      {experience.position}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {experience.companyName} ·{" "}
                      {formatExperiencePeriod(
                        experience.startDate,
                        experience.endDate,
                      )}
                    </p>
                    <p className="text-foreground mt-2 text-sm leading-6">
                      {experience.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-foreground mt-1 text-base">{value}</dd>
    </div>
  );
}

function DocumentStatus({
  label,
  present,
}: {
  label: string;
  present: boolean;
}) {
  return (
    <div className="border-border rounded-lg border px-4 py-3">
      <p className="text-foreground text-sm font-medium">{label}</p>
      <p className="text-muted-foreground mt-1 text-sm">
        {present ? "Sudah diunggah" : "Belum diunggah"}
      </p>
    </div>
  );
}

function ProfilePhoto({
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
    <div
      aria-hidden="true"
      className="bg-secondary text-secondary-foreground flex size-20 shrink-0 items-center justify-center rounded-full text-xl font-semibold"
    >
      {initialsFromName(name)}
    </div>
  );
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
