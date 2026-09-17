"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { reviewAdminInquiry } from "@/lib/api/admin";
import {
  INQUIRY_STATUS_LABEL,
  type AdminInquiry,
} from "@/lib/types/inquiry";
import {
  DISABILITY_FRIENDLY_LABEL,
  JOB_TYPE_LABEL,
} from "@/lib/types/job";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

type AdminInquiryReviewListProps = {
  inquiries: AdminInquiry[];
};

export function AdminInquiryReviewList({
  inquiries,
}: AdminInquiryReviewListProps) {
  if (inquiries.length === 0) {
    return (
      <p
        role="status"
        className="border-border bg-card text-muted-foreground rounded-xl border px-4 py-10 text-center text-base"
      >
        Tidak ada kebutuhan pada saringan ini. Lowongan baru hanya tampil di
        portal setelah kebutuhan perusahaan disetujui.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4 p-0">
      {inquiries.map((inquiry) => (
        <li key={inquiry.id}>
          <InquiryReviewCard inquiry={inquiry} />
        </li>
      ))}
    </ul>
  );
}

function InquiryReviewCard({ inquiry }: { inquiry: AdminInquiry }) {
  const formId = useId();
  const router = useRouter();
  const [note, setNote] = useState(inquiry.reviewNote);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const pending = inquiry.status === "menunggu";

  async function decide(keputusan: "disetujui" | "ditolak") {
    setBusy(true);
    setMessage("");
    const result = await reviewAdminInquiry(inquiry.id, {
      keputusan,
      catatan: note.trim(),
    });
    setBusy(false);

    if ("error" in result) {
      setMessage(result.error);
      return;
    }

    setMessage(
      keputusan === "disetujui"
        ? "Kebutuhan disetujui. Lowongan sekarang tampil di portal publik."
        : "Kebutuhan ditolak. Lowongan tidak ditampilkan ke publik.",
    );
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {inquiry.title}
        </CardTitle>
        <CardDescription>
          {inquiry.company.name} · {inquiry.location}
        </CardDescription>
        <Badge
          variant={inquiry.status === "disetujui" ? "default" : "outline"}
          className="mt-2 w-fit"
        >
          {INQUIRY_STATUS_LABEL[inquiry.status]}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-foreground text-sm leading-6">{inquiry.description}</p>
        <p className="text-muted-foreground text-sm leading-6">
          Syarat: {inquiry.requirements}
        </p>
        <p className="text-muted-foreground text-sm">
          {JOB_TYPE_LABEL[inquiry.jobType]} ·{" "}
          {DISABILITY_FRIENDLY_LABEL[inquiry.disabilityFriendlyType]} ·{" "}
          {inquiry.headcount} orang
        </p>
        {inquiry.reviewNote ? (
          <p className="text-foreground text-sm">
            Catatan tinjauan: {inquiry.reviewNote}
          </p>
        ) : null}
        {pending ? (
          <div className="flex flex-col gap-3">
            <Label htmlFor={`${formId}-catatan`}>Catatan untuk perusahaan</Label>
            <textarea
              id={`${formId}-catatan`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-lg border px-3 py-2 text-base outline-none focus-visible:ring-3 md:text-sm"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={busy}
                onClick={() => void decide("disetujui")}
                className={buttonVariants({
                  size: "lg",
                  className: "min-h-11 px-4",
                })}
              >
                Setujui dan tayangkan
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void decide("ditolak")}
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "min-h-11 px-4",
                })}
              >
                Tolak
              </button>
            </div>
          </div>
        ) : null}
        {message ? (
          <p role="status" className="text-foreground text-sm">
            {message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
