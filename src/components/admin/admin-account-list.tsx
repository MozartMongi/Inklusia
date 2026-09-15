import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ADMIN_ACCOUNT_KIND_LABEL,
  ADMIN_ACCOUNT_STATUS_LABEL,
  type AdminAccount,
} from "@/lib/types/admin-account";
import Link from "next/link";

type AdminAccountListProps = {
  accounts: AdminAccount[];
};

export function AdminAccountList({ accounts }: AdminAccountListProps) {
  return (
    <section aria-labelledby="daftar-admin-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between">
        <h2
          id="daftar-admin-heading"
          className="text-foreground text-xl font-semibold"
        >
          Daftar akun admin
        </h2>
        <p
          id="hasil-akun-admin"
          tabIndex={-1}
          aria-live="polite"
          className="text-muted-foreground focus-visible:ring-ring scroll-mt-24 rounded-sm text-sm outline-none focus-visible:ring-3"
        >
          {accounts.length} akun admin ditampilkan
        </p>
      </div>
      {accounts.length === 0 ? (
        <p
          role="status"
          className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
        >
          Belum ada akun admin yang tercatat.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2">
          {accounts.map((account) => (
            <li key={account.id} className="min-w-0">
              <Card className="relative h-full overflow-visible">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    <h3 className="text-lg leading-snug font-semibold">
                      <Link
                        href={`/admin/akun/${account.id}/ubah`}
                        className="focus-visible:ring-ring after:absolute after:inset-0 after:rounded-xl hover:underline focus-visible:ring-3 focus-visible:outline-none"
                      >
                        {account.fullName}
                      </Link>
                    </h3>
                  </CardTitle>
                  <CardDescription>{account.email}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={
                        account.kind === "root" ? "default" : "secondary"
                      }
                    >
                      {ADMIN_ACCOUNT_KIND_LABEL[account.kind]}
                    </Badge>
                    <Badge
                      variant={
                        account.status === "aktif" ? "outline" : "secondary"
                      }
                    >
                      {ADMIN_ACCOUNT_STATUS_LABEL[account.status]}
                    </Badge>
                  </div>
                  <dl className="text-muted-foreground grid gap-1 text-sm">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-foreground font-medium">Dibuat</dt>
                      <dd>{formatAdminDate(account.createdAt)}</dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="text-foreground font-medium">
                        Diperbarui
                      </dt>
                      <dd>{formatAdminDate(account.updatedAt)}</dd>
                    </div>
                  </dl>
                  {account.kind === "root" ? (
                    <p className="text-muted-foreground text-sm leading-6">
                      Akun root digenerate di awal dan tidak dapat
                      dinonaktifkan.
                    </p>
                  ) : null}
                  <p className="text-primary relative z-10 text-sm font-medium">
                    Kelola akun
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatAdminDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
}
