import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanyProfile } from "@/lib/types/company";

type CompanyProfileViewProps = {
  profile: CompanyProfile;
};

export function CompanyProfileView({ profile }: CompanyProfileViewProps) {
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
        </CardHeader>
        <CardContent>
          <ProfileFields
            heading="Data perusahaan"
            items={[
              { label: "Nama perusahaan", value: profile.name },
              { label: "Alamat", value: profile.address },
              { label: "Industri", value: profile.industry },
              { label: "NIB", value: profile.nib },
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground text-lg font-semibold">
            Kontak person
          </CardTitle>
          <CardDescription className="mt-1 text-base">
            Orang yang dihubungi admin saat menyalurkan kandidat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileFields
            heading="Data kontak person"
            items={[
              { label: "Nama", value: profile.contactPerson.name },
              { label: "Jabatan", value: profile.contactPerson.position },
              { label: "Nomor telepon", value: profile.contactPerson.phone },
              { label: "Email", value: profile.contactPerson.email },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileFields({
  heading,
  items,
}: {
  heading: string;
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <section aria-label={heading}>
      <dl className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-muted-foreground text-sm font-medium">
              {item.label}
            </dt>
            <dd className="text-foreground mt-1 text-base leading-6">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
