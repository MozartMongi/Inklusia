import { CvDownloadButton } from "@/components/cv/cv-download-button";
import { CvPreview } from "@/components/cv/cv-preview";
import type { GeneratedCv } from "@/lib/types/cv";

type CvWorkspaceProps = {
  cv: GeneratedCv;
};

export function CvWorkspace({ cv }: CvWorkspaceProps) {
  return (
    <section aria-labelledby="cv-pratinjau-heading">
      <h2
        id="cv-pratinjau-heading"
        className="text-foreground mb-3 text-xl font-semibold tracking-tight"
      >
        Pratinjau CV
      </h2>
      <p className="text-muted-foreground mb-4 text-base leading-7">
        Tampilan ini memakai tata letak profesional dari data profil Anda.
      </p>
      <CvDownloadButton cv={cv} />
      <CvPreview cv={cv} />
    </section>
  );
}
