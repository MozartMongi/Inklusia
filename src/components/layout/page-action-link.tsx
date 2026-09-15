import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

type PageActionsProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
};

export function PageActions({
  children,
  className,
  label = "Aksi halaman",
}: PageActionsProps) {
  return (
    <nav
      aria-label={label}
      className={cn("mt-5 flex flex-wrap gap-2", className)}
    >
      {children}
    </nav>
  );
}

type PageActionLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: "default" | "outline" | "secondary";
  tone?: "forward" | "back";
  className?: string;
};

export function PageActionLink({
  variant = "outline",
  tone = "forward",
  className,
  children,
  ...props
}: PageActionLinkProps) {
  const isBack = tone === "back";

  return (
    <Link
      className={cn(
        buttonVariants({
          variant,
          size: "lg",
          className: "h-auto min-h-11 gap-1.5 px-4 whitespace-normal",
        }),
        className,
      )}
      {...props}
    >
      {isBack ? <ArrowLeft aria-hidden="true" className="size-4 shrink-0" /> : null}
      {children}
      {isBack ? null : (
        <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
      )}
    </Link>
  );
}
