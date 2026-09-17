"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createContactLog } from "@/lib/api/placements";
import {
  phoneHref,
  validateContactForm,
  whatsappHref,
  type ContactFormErrors,
  type ContactFormValues,
} from "@/lib/placements/contact";
import { formatPlacementDate } from "@/lib/placements/format";
import {
  CONTACT_CHANNEL_LABEL,
  type ContactChannel,
  type JobSeekerSummary,
  type PlacementContactLog,
} from "@/lib/types/placement";
import { useId, useState, type FormEvent } from "react";

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

const CHANNEL_OPTIONS = Object.entries(CONTACT_CHANNEL_LABEL) as [
  ContactChannel,
  string,
][];

type ContactPanelProps = {
  seeker: JobSeekerSummary | null;
  logs: PlacementContactLog[];
};

export function ContactPanel({ seeker, logs }: ContactPanelProps) {
  return (
    <ContactPanelInner key={seeker?.id ?? "none"} seeker={seeker} logs={logs} />
  );
}

function ContactPanelInner({ seeker, logs }: ContactPanelProps) {
  const formId = useId();
  const [values, setValues] = useState<ContactFormValues>({
    channel: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [step, setStep] = useState<"form" | "confirm" | "saved">("form");
  const [addedLogs, setAddedLogs] = useState<PlacementContactLog[]>([]);
  const history = [
    ...addedLogs,
    ...logs.filter((log) => !addedLogs.some((item) => item.id === log.id)),
  ];

  function update<K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setStep("form");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!seeker) {
      return;
    }

    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);

    if (nextErrors.channel) {
      document.getElementById(`${formId}-channel`)?.focus();
      return;
    }
    if (nextErrors.message) {
      document.getElementById(`${formId}-message`)?.focus();
      return;
    }

    setStep("confirm");
  }

  async function handleConfirm() {
    if (!seeker || !values.channel) {
      return;
    }

    const result = await createContactLog({
      jobSeekerId: seeker.id,
      channel: values.channel,
      message: values.message.trim(),
    });
    if ("error" in result) {
      setErrors({ message: result.error });
      setStep("form");
      return;
    }
    setAddedLogs((current) => [result.data, ...current]);
    setValues({ channel: "", message: "" });
    setStep("saved");
  }

  return (
    <section id="hubungi" className="scroll-mt-24" aria-labelledby="hubungi-heading">
      <Card>
        <CardHeader>
          <CardTitle id="hubungi-heading" className="text-xl font-semibold">
            Hubungi kandidat
          </CardTitle>
          <CardDescription>
            Admin menghubungi pencari kerja, lalu mencatat saluran dan hasilnya.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!seeker ? (
            <p className="text-muted-foreground text-sm">
              Pilih pencari kerja di daftar atas untuk melihat nomor, email, dan
              mencatat kontak.
            </p>
          ) : (
            <>
              <div>
                <p className="text-foreground text-sm font-medium">
                  {seeker.fullName}
                </p>
                {seeker.disabilityType === "tuli" ? (
                  <p className="text-muted-foreground mt-1 text-sm">
                    Kandidat tuli. Utamakan email atau WhatsApp tertulis.
                  </p>
                ) : null}
                <ul className="mt-3 flex flex-col gap-2 text-sm">
                  <li>
                    <span className="text-muted-foreground">Telepon: </span>
                    <a
                      href={phoneHref(seeker.phone)}
                      className="text-primary font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
                    >
                      {seeker.phone}
                    </a>
                  </li>
                  <li>
                    <span className="text-muted-foreground">Email: </span>
                    <a
                      href={`mailto:${seeker.email}`}
                      className="text-primary font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
                    >
                      {seeker.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={whatsappHref(seeker.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
                    >
                      Buka percakapan WhatsApp
                    </a>
                  </li>
                </ul>
              </div>

              {step === "saved" ? (
                <p role="status" className="text-foreground text-sm">
                  Kontak ke {seeker.fullName} sudah dicatat.
                </p>
              ) : null}

              {step === "confirm" && values.channel ? (
                <div className="flex flex-col gap-4">
                  <p className="text-foreground text-sm leading-6">
                    Catat kontak {CONTACT_CHANNEL_LABEL[values.channel]} ke{" "}
                    <span className="font-medium">{seeker.fullName}</span>?
                  </p>
                  <p className="text-muted-foreground text-sm leading-6">
                    {values.message.trim()}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className={buttonVariants({
                        size: "lg",
                        className: "min-h-11 w-full px-4 sm:w-auto",
                      })}
                    >
                      Ya, simpan catatan
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className={buttonVariants({
                        variant: "outline",
                        size: "lg",
                        className: "min-h-11 w-full px-4 sm:w-auto",
                      })}
                    >
                      Kembali ke formulir
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReview} className="flex flex-col gap-4" noValidate>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${formId}-channel`}>Saluran (wajib)</Label>
                    <select
                      id={`${formId}-channel`}
                      name="channel"
                      required
                      value={values.channel}
                      onChange={(event) =>
                        update("channel", event.target.value as ContactChannel | "")
                      }
                      aria-invalid={Boolean(errors.channel)}
                      aria-describedby={
                        errors.channel ? `${formId}-channel-error` : undefined
                      }
                      className={fieldClassName}
                    >
                      <option value="">Pilih saluran</option>
                      {CHANNEL_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.channel ? (
                      <p
                        id={`${formId}-channel-error`}
                        role="alert"
                        className="text-destructive text-sm"
                      >
                        {errors.channel}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`${formId}-message`}>Catatan kontak (wajib)</Label>
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={4}
                      required
                      value={values.message}
                      onChange={(event) => update("message", event.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? `${formId}-message-error` : undefined
                      }
                      className={`${fieldClassName} min-h-28 py-2`}
                      placeholder="Contoh: mengirim email bahwa profil sudah diteruskan."
                    />
                    {errors.message ? (
                      <p
                        id={`${formId}-message-error`}
                        role="alert"
                        className="text-destructive text-sm"
                      >
                        {errors.message}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className={buttonVariants({
                      size: "lg",
                      className: "min-h-11 w-full px-4 sm:w-auto",
                    })}
                  >
                    Tinjau catatan
                  </button>
                </form>
              )}

              <div>
                <h3 className="text-foreground text-base font-semibold">
                  Riwayat kontak
                </h3>
                {history.length === 0 ? (
                  <p className="text-muted-foreground mt-2 text-sm">
                    Belum ada catatan kontak untuk kandidat ini.
                  </p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-3">
                    {history.map((log) => (
                      <li
                        key={log.id}
                        className="border-border rounded-lg border px-3 py-3 text-sm"
                      >
                        <p className="text-foreground font-medium">
                          {CONTACT_CHANNEL_LABEL[log.channel]}
                        </p>
                        <p className="text-muted-foreground mt-1">
                          {formatPlacementDate(log.createdAt)}
                        </p>
                        <p className="text-foreground mt-2 leading-6">
                          {log.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
