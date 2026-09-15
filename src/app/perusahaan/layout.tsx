import { CompanyAccessDenied } from "@/components/company/company-access-denied";
import { requireCompanySession } from "@/lib/auth/session";

export default async function CompanySpaceLayout({
  children,
}: LayoutProps<"/perusahaan">) {
  const access = await requireCompanySession();

  if (!access.ok) {
    return <CompanyAccessDenied role={access.session.role} />;
  }

  return children;
}
