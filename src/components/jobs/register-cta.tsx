import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type RegisterCtaProps = {
  className?: string;
  compact?: boolean;
  ariaCurrent?: boolean;
};

export function RegisterCta({
  className,
  compact = false,
  ariaCurrent = false,
}: RegisterCtaProps) {
  return (
    <Link
      href="/daftar"
      aria-label="Daftarkan Diri / Perusahaan Anda"
      aria-current={ariaCurrent ? "page" : undefined}
      className={cn(
        buttonVariants({
          size: "lg",
          className:
            "h-auto min-h-11 shrink whitespace-normal px-3 text-center leading-snug sm:px-4",
        }),
        className,
      )}
    >
      {compact ? (
        <>
          <span className="sm:hidden">Daftar</span>
          <span className="hidden sm:inline">
            Daftarkan Diri / Perusahaan Anda
          </span>
        </>
      ) : (
        "Daftarkan Diri / Perusahaan Anda"
      )}
    </Link>
  );
}
