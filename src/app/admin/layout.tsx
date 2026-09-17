import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/auth/session";

export default async function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  const access = await requireAdminSession();

  if (!access.ok) {
    return <AdminAccessDenied role={access.session.role} />;
  }

  return <AdminShell>{children}</AdminShell>;
}
