import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanyProfile } from "@/lib/types/company";
import {
  INQUIRY_STATUS_LABEL,
  type CompanyInquiry,
} from "@/lib/types/inquiry";
import {
  DISABILITY_FRIENDLY_LABEL,
  JOB_TYPE_LABEL,
} from "@/lib/types/job";

type AdminCompanyDetailProps = {
  profile: CompanyProfile;
  inquiries: CompanyInquiry[];
};

export function AdminCompanyDetail({
  profile,
  inquiries,
}: AdminCompanyDetailProps) {
  const inclusionMessage = profile.inclusionMessage?.trim() ?? "";
  const approvedCount = inquiries.filter(
    (inquiry) => inquiry.status === "disetujui",
  ).length;
  const pendingCount = inquiries.filter(
    (inquiry) => inquiry.status === "menunggu",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground text-2xl font-semibold">
            {profile.name}
          </CardTitle>
          <CardDescription className="mt-1 text-base">
            {profile.industry}
          </CardDescription>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {pendingCount > 0
                ? `${pendingCount} menunggu tinjauan`
                : "Tidak ada yang menunggu tinjauan"}
            </Badge>
            <Badge variant="outline">
              {approvedCount > 0
                ? `${approvedCount} lowongan tayang`
                : "Tidak ada lowongan tayang"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <section aria-labelledby="data-perusahaan-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2
                id="data-perusahaan-heading"
                className="text-xl font-semibold"
              >
                Data perusahaan
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Nama perusahaan" value={profile.name} />
              <DetailItem label="Industri" value={profile.industry} />
              <DetailItem label="Alamat" value={profile.address} />
              <DetailItem label="NIB" value={profile.nib} />
              <DetailItem
                label="Terakhir diperbarui"
                value={formatUpdatedAt(profile.updatedAt)}
              />
            </dl>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="kontak-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="kontak-heading" className="text-xl font-semibold">
                Kontak person
              </h2>
            </CardTitle>
            <CardDescription>
              Orang yang dihubungi admin saat menyalurkan kandidat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="Nama" value={profile.contactPerson.name} />
              <DetailItem
                label="Jabatan"
                value={profile.contactPerson.position}
              />
              <DetailItem
                label="Nomor telepon"
                value={profile.contactPerson.phone}
              />
              <DetailItem label="Email" value={profile.contactPerson.email} />
            </dl>
          </CardContent>
        </Card>
      </section>

      {inclusionMessage ? (
        <section aria-labelledby="pesan-inklusi-heading">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                <h2
                  id="pesan-inklusi-heading"
                  className="text-xl font-semibold"
                >
                  Pesan yang ingin disampaikan
                </h2>
              </CardTitle>
              <CardDescription>
                Catatan dari perusahaan saat mendaftar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground text-base leading-7 whitespace-pre-wrap">
                {inclusionMessage}
              </p>
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section aria-labelledby="inquiry-heading">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <h2 id="inquiry-heading" className="text-xl font-semibold">
                Inquiry kebutuhan
              </h2>
            </CardTitle>
            <CardDescription>
              Ringkasan kebutuhan karyawan yang diajukan perusahaan (baca saja).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Belum ada inquiry kebutuhan dari perusahaan ini.
              </p>
            ) : (
              <ul className="flex flex-col gap-3 p-0">
                {inquiries.map((inquiry) => (
                  <li
                    key={inquiry.id}
                    className="border-border rounded-lg border px-4 py-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-foreground font-semibold">
                        {inquiry.title}
                      </p>
                      <Badge
                        variant={
                          inquiry.status === "disetujui" ? "default" : "outline"
                        }
                      >
                        {INQUIRY_STATUS_LABEL[inquiry.status]}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {inquiry.description}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {inquiry.location} · {JOB_TYPE_LABEL[inquiry.jobType]} ·{" "}
                      {DISABILITY_FRIENDLY_LABEL[inquiry.disabilityFriendlyType]}{" "}
                      · {inquiry.headcount} orang
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
