export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:px-6">
        <div className="flex max-w-xl flex-col gap-1">
          <p className="text-foreground font-medium">Inklusia.id</p>
          <p>
            Portal kerja yang menghubungkan penyandang disabilitas dengan
            perusahaan inklusif.
          </p>
        </div>
        <div className="flex flex-col items-end text-right">
          <p className="text-foreground font-medium">Hubungi kami</p>
          <a
            href="mailto:info@inklusia.id"
            className="text-primary focus-visible:ring-ring mt-1 inline-flex min-h-11 items-center rounded-sm font-medium underline underline-offset-4 hover:decoration-2 focus-visible:ring-3 focus-visible:outline-none"
          >
            info@inklusia.id
          </a>
        </div>
      </div>
    </footer>
  );
}
