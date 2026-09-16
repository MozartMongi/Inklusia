"use client";

import { PageActionLink } from "@/components/layout/page-action-link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateCompanyInquiryStatus } from "@/lib/api/inquiries";
import {
  INQUIRY_STATUS_LABEL,
  type CompanyInquiry,
  type InquiryStatus,
} from "@/lib/types/inquiry";
import {
  DISABILITY_FRIENDLY_LABEL,
  JOB_TYPE_LABEL,
} from "@/lib/types/job";
import { Briefcase, MapPin, Users } from "lucide-react";
import { useState } from "react";

type InquiryCardProps = {
  inquiry: CompanyInquiry;
};

export function InquiryCard({ inquiry }: InquiryCardProps) {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function changeStatus(nextStatus: InquiryStatus) {
    setBusy(true);
    const result = await updateCompanyInquiryStatus(inquiry.id, nextStatus);
    setBusy(false);

    if (!result) {
      setMessage("Status inquiry tidak bisa diubah.");
      return;
    }

    setStatus(result.data.status);
    setMessage(
      result.data.status === "ditutup"
        ? "Inquiry ditutup (simulasi, belum ke server)."
        : "Inquiry dibuka kembali (simulasi, belum ke server).",
    );
  }

  return (
    <article>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            <h2 className="text-lg leading-snug font-semibold">
              {inquiry.title}
            </h2>
          </CardTitle>
          <CardDescription>
            Diajukan pada {formatInquiryDate(inquiry.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Badge
            variant={status === "terbuka" ? "default" : "outline"}
            className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
          >
            {INQUIRY_STATUS_LABEL[status]}
          </Badge>
          <p className="text-muted-foreground text-sm leading-6">
            {inquiry.description}
          </p>
          <ul className="text-foreground flex flex-col gap-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="sr-only">Lokasi: </span>
                {inquiry.location}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Briefcase
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span>
                <span className="sr-only">Jenis pekerjaan: </span>
                {JOB_TYPE_LABEL[inquiry.jobType]}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Users aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="sr-only">Jumlah karyawan: </span>
                {inquiry.headcount} orang
              </span>
            </li>
          </ul>
          <Badge
            variant="secondary"
            className="h-auto max-w-full px-2.5 py-1 text-left text-xs leading-4 whitespace-normal"
          >
            {DISABILITY_FRIENDLY_LABEL[inquiry.disabilityFriendlyType]}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {status === "terbuka" ? (
            <PageActionLink href={`/perusahaan/kebutuhan/${inquiry.id}/ubah`}>
              Ubah inquiry
            </PageActionLink>
          ) : (
            <p className="text-muted-foreground text-sm">
              Inquiry ditutup, tidak bisa diubah.
            </p>
          )}
          {status === "terbuka" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatus("ditutup")}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "min-h-11 px-4",
              })}
            >
              Tutup inquiry
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeStatus("terbuka")}
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 px-4",
              })}
            >
              Buka kembali
            </button>
          )}
          <p role="status" aria-live="polite" className="text-foreground text-sm">
            {message}
          </p>
        </CardFooter>
      </Card>
    </article>
  );
}

function formatInquiryDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}
