import type { AdminAccount } from "@/lib/types/admin-account";

export const MOCK_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: "adm-001",
    fullName: "Root Inklusia",
    email: "info@inklusia.id",
    kind: "root",
    status: "aktif",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "adm-002",
    fullName: "Ayu Prameswari",
    email: "ayu.prameswari@inklusia.id",
    kind: "admin",
    status: "aktif",
    createdAt: "2026-03-12T08:00:00.000Z",
    updatedAt: "2026-09-01T09:00:00.000Z",
  },
  {
    id: "adm-003",
    fullName: "Fajar Nugraha",
    email: "fajar.nugraha@inklusia.id",
    kind: "admin",
    status: "aktif",
    createdAt: "2026-05-20T10:30:00.000Z",
    updatedAt: "2026-08-15T11:00:00.000Z",
  },
  {
    id: "adm-004",
    fullName: "Sinta Lestari",
    email: "sinta.lestari@inklusia.id",
    kind: "admin",
    status: "nonaktif",
    createdAt: "2026-02-08T07:15:00.000Z",
    updatedAt: "2026-07-22T14:00:00.000Z",
  },
];

/** Store mutabel untuk stub frontend create/update/deactivate. */
export const adminAccountsStore: AdminAccount[] = MOCK_ADMIN_ACCOUNTS.map(
  (account) => ({ ...account }),
);
