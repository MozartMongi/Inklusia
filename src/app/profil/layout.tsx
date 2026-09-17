import { SeekerAccessDenied } from "@/components/profile/seeker-access-denied";
import { requireJobSeekerSession } from "@/lib/auth/session";

export default async function JobSeekerSpaceLayout({
  children,
}: LayoutProps<"/profil">) {
  const access = await requireJobSeekerSession();

  if (!access.ok) {
    return <SeekerAccessDenied role={access.session.role} />;
  }

  return children;
}
