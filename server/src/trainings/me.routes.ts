import { Router } from "express";
import { requireAuth, requireJobSeeker } from "../auth/middleware.js";
import { isUuid } from "../db/ids.js";
import { currentUserId } from "../profiles/current-user.js";
import { findProfileIdByUserId } from "../profiles/profiles.repository.js";
import {
  enrollProfileInTraining,
  findPublishedTrainingById,
  listEnrollmentsForProfile,
} from "./trainings.repository.js";

export const meTrainingsRouter = Router();

meTrainingsRouter.use(requireAuth, requireJobSeeker);

/**
 * GET /api/me/pelatihan → { data: TrainingEnrollment[] }
 */
meTrainingsRouter.get("/pelatihan", async (req, res, next) => {
  try {
    const profileId = await findProfileIdByUserId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const data = await listEnrollmentsForProfile(profileId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/me/pelatihan → { data: TrainingEnrollment }
 * Body: { trainingId: string }
 */
meTrainingsRouter.post("/pelatihan", async (req, res, next) => {
  try {
    const profileId = await findProfileIdByUserId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};
    const trainingId =
      typeof body.trainingId === "string" ? body.trainingId.trim() : "";

    if (!trainingId || !isUuid(trainingId)) {
      res.status(400).json({
        error: "Pelatihan wajib dipilih.",
        errors: { trainingId: "ID pelatihan tidak valid." },
      });
      return;
    }

    const training = await findPublishedTrainingById(trainingId);
    if (!training) {
      res.status(404).json({ error: "Pelatihan tidak ditemukan." });
      return;
    }

    const result = await enrollProfileInTraining(trainingId, profileId);
    if ("error" in result) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.status(201).json({ data: result.data });
  } catch (error) {
    next(error);
  }
});
