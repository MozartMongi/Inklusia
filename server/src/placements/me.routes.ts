import { Router } from "express";
import { requireAuth, requireJobSeeker } from "../auth/middleware.js";
import { currentUserId } from "../profiles/current-user.js";
import { findProfileIdByUserId } from "../profiles/profiles.repository.js";
import { listPlacementsForProfile } from "./placements.repository.js";

export const mePenyaluranRouter = Router();

mePenyaluranRouter.use(requireAuth, requireJobSeeker);

const CURRENT_STATUSES = ["menunggu", "dikirim"] as const;

async function requireSeekerProfileId(userId: string) {
  return findProfileIdByUserId(userId);
}

mePenyaluranRouter.get("/penyaluran/riwayat", async (req, res, next) => {
  try {
    const profileId = await requireSeekerProfileId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const data = await listPlacementsForProfile(profileId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

mePenyaluranRouter.get("/penyaluran", async (req, res, next) => {
  try {
    const profileId = await requireSeekerProfileId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const data = await listPlacementsForProfile(profileId, {
      statuses: CURRENT_STATUSES,
    });
    res.json({ data });
  } catch (error) {
    next(error);
  }
});
