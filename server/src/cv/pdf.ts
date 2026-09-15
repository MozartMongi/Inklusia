import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  JOB_SEEKER_DISABILITY_LABEL,
  SKILL_LEVEL_LABEL,
} from "../db/job-seeker-schema.js";
import type { GeneratedCv } from "./generated-cv.js";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const ACCENT = rgb(0.12, 0.27, 0.45);
const TEXT = rgb(0.12, 0.12, 0.14);
const MUTED = rgb(0.32, 0.34, 0.38);

export function cvPdfFileName(cv: GeneratedCv): string {
  const slug = cv.fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `cv-${slug || "pencari-kerja"}-profesional.pdf`;
}

export async function buildProfessionalCvPdf(cv: GeneratedCv): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  let page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN) {
      page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  };

  const write = (
    text: string,
    options: { font?: typeof regular; size?: number; color?: ReturnType<typeof rgb> } = {},
  ) => {
    const font = options.font ?? regular;
    const size = options.size ?? 11;
    const color = options.color ?? TEXT;
    const maxWidth = PAGE_WIDTH - MARGIN * 2;
    const lines = wrapText(text, font, size, maxWidth);
    for (const line of lines) {
      ensureSpace(size + 6);
      page.drawText(line, {
        x: MARGIN,
        y: y - size,
        size,
        font,
        color,
      });
      y -= size + 4;
    }
  };

  page.drawRectangle({
    x: 0,
    y: 0,
    width: 8,
    height: PAGE_HEIGHT,
    color: ACCENT,
  });

  write(cv.fullName.toUpperCase(), { font: bold, size: 20, color: ACCENT });
  write([cv.email, cv.phone].filter(Boolean).join("  ·  "), {
    size: 10,
    color: MUTED,
  });
  if (cv.address.trim()) {
    write(cv.address, { size: 10, color: MUTED });
  }
  write(JOB_SEEKER_DISABILITY_LABEL[cv.disabilityType], {
    size: 10,
    color: MUTED,
  });
  y -= 8;

  const heading = (label: string) => {
    y -= 6;
    write(label.toUpperCase(), { font: bold, size: 11, color: ACCENT });
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.7,
      color: ACCENT,
    });
    y -= 10;
  };

  heading("Ringkasan");
  write(cv.bio.trim() || "Ringkasan belum diisi pada profil.");
  y -= 4;

  heading("Keahlian");
  if (cv.skills.length === 0) {
    write("Belum ada keahlian pada profil.");
  } else {
    for (const skill of cv.skills) {
      write(`${skill.skillName} (${SKILL_LEVEL_LABEL[skill.level]})`);
    }
  }
  y -= 4;

  heading("Pengalaman kerja");
  if (cv.experiences.length === 0) {
    write("Belum ada pengalaman kerja pada profil.");
  } else {
    for (const experience of cv.experiences) {
      const period = experience.endDate
        ? `${experience.startDate} – ${experience.endDate}`
        : `${experience.startDate} – sekarang`;
      write(experience.position, { font: bold, size: 11 });
      write(`${experience.companyName}  ·  ${period}`, { size: 10, color: MUTED });
      if (experience.description.trim()) {
        write(experience.description);
      }
      y -= 6;
    }
  }

  return document.save();
}

function wrapText(
  text: string,
  font: { widthOfTextAtSize: (value: string, size: number) => number },
  size: number,
  maxWidth: number,
): string[] {
  const normalized = text.replace(/\s+/g, " ").trim() || " ";
  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }
    if (current) {
      lines.push(current);
    }
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}
