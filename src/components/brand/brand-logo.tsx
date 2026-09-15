import { BRAND_LOGO } from "@/lib/brand";
import { cn } from "@/lib/utils";
import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  /** True jika induk (mis. tautan) sudah punya nama aksesibel. */
  decorative?: boolean;
};

export function BrandLogo({
  className,
  priority = false,
  decorative = false,
}: BrandLogoProps) {
  return (
    <Image
      src={BRAND_LOGO.src}
      alt={decorative ? "" : BRAND_LOGO.alt}
      width={BRAND_LOGO.width}
      height={BRAND_LOGO.height}
      priority={priority}
      className={cn("h-10 w-auto mix-blend-multiply sm:h-12 md:h-14", className)}
    />
  );
}
