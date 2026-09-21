"use client";

import { buttonVariants } from "@/components/ui/button";
import { deleteAdminCompany, deleteAdminJobSeeker } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

type AdminDeleteUserButtonProps = {
  id: string;
  entityName: string;
  entityLabel: "pencari kerja" | "perusahaan";
};

export function AdminDeleteUserButton({
  id,
  entityName,
  entityLabel,
}: AdminDeleteUserButtonProps) {
  const router = useRouter();
  const dialogTitleId = useId();
  const dialogDescId = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirmDelete() {
    setBusy(true);
    setError("");
    const result =
      entityLabel === "perusahaan"
        ? await deleteAdminCompany(id)
        : await deleteAdminJobSeeker(id);
    setBusy(false);

    if (!result) {
      setError(
        entityLabel === "perusahaan"
          ? "Perusahaan tidak ditemukan."
          : "Pencari kerja tidak ditemukan.",
      );
      return;
    }

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "destructive", size: "icon" }),
          "relative z-10 size-9 shrink-0",
        )}
        aria-label={`Hapus ${entityLabel} ${entityName}`}
        title={`Hapus ${entityLabel}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setError("");
          setOpen(true);
        }}
      >
        <Trash2 aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="presentation"
          onClick={() => {
            if (!busy) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescId}
            className="border-border bg-background w-full max-w-md rounded-xl border p-5 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id={dialogTitleId}
              className="text-foreground text-lg font-semibold"
            >
              Hapus {entityLabel}?
            </h2>
            <p
              id={dialogDescId}
              className="text-muted-foreground mt-2 text-sm leading-6"
            >
              Akun{" "}
              <span className="text-foreground font-medium">{entityName}</span>{" "}
              akan dihapus permanen beserta data terkait. Tindakan ini tidak
              dapat dibatalkan.
            </p>
            {error ? (
              <p className="text-destructive mt-3 text-sm" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-11 px-4",
                )}
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "destructive", size: "lg" }),
                  "min-h-11 px-4",
                )}
                disabled={busy}
                onClick={() => {
                  void confirmDelete();
                }}
              >
                {busy ? "Menghapus…" : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
