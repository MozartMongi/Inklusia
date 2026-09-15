export type AdminAccountKind = "root" | "admin";

export type AdminAccountStatus = "aktif" | "nonaktif";

export type AdminAccount = {
  id: string;
  fullName: string;
  email: string;
  kind: AdminAccountKind;
  status: AdminAccountStatus;
  createdAt: string;
  updatedAt: string;
};

export const ADMIN_ACCOUNT_KIND_LABEL: Record<AdminAccountKind, string> = {
  root: "Root admin",
  admin: "Admin",
};

export const ADMIN_ACCOUNT_STATUS_LABEL: Record<AdminAccountStatus, string> = {
  aktif: "Aktif",
  nonaktif: "Nonaktif",
};
