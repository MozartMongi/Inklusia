import { Router } from "express";
import { requireAuth, requireJobSeeker } from "../auth/middleware.js";
import { currentUserId } from "../profiles/current-user.js";
import { findProfileIdByUserId } from "../profiles/profiles.repository.js";
import { aggregateProfileForCv } from "./aggregate-profile.js";
import {
  ensureCvPreference,
  findCvPreferenceByProfileId,
  markCvDownloaded,
} from "./cv-preferences.repository.js";
import { buildProfessionalCvPdf, cvPdfFileName } from "./pdf.js";

export const meCvRouter = Router();

meCvRouter.use(requireAuth, requireJobSeeker);

meCvRouter.get("/cv", async (req, res, next) => {
  try {
    if (req.query.template || req.query.templateId) {
      res.status(400).json({
        error: "CV tidak memiliki pilihan template. Tata letak selalu profesional.",
      });
      return;
    }

    const profileId = await findProfileIdByUserId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const data = await aggregateProfileForCv(profileId);
    if (!data) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

meCvRouter.post("/cv/unduh", async (req, res, next) => {
  try {
    if (hasTemplateChoice(req.body)) {
      res.status(400).json({
        error: "CV tidak memiliki pilihan template. Tata letak selalu profesional.",
      });
      return;
    }

    const profileId = await findProfileIdByUserId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const cv = await aggregateProfileForCv(profileId);
    if (!cv) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const pdf = await buildProfessionalCvPdf(cv);
    await markCvDownloaded(profileId, new Date());
    const fileName = cvPdfFileName(cv);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(Buffer.from(pdf));
  } catch (error) {
    next(error);
  }
});

function hasTemplateChoice(body: unknown): boolean {
  if (!body || typeof body !== "object") {
    return false;
  }
  return "templateId" in body || "template" in body;
}

meCvRouter.get("/cv/preferensi", async (req, res, next) => {
  try {
    const profileId = await findProfileIdByUserId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const data = await findCvPreferenceByProfileId(profileId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

meCvRouter.put("/cv/preferensi", async (req, res, next) => {
  try {
    if (hasTemplateChoice(req.body)) {
      res.status(400).json({
        error: "CV tidak memiliki pilihan template. Tata letak selalu profesional.",
      });
      return;
    }

    const profileId = await findProfileIdByUserId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const data = await ensureCvPreference(profileId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});
