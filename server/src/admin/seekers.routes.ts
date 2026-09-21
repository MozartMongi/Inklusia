import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth/middleware.js";
import { isUuid } from "../db/ids.js";
import {
  findProfileById,
  findProfileByUserId,
} from "../profiles/profiles.repository.js";
import {
  deleteAdminSeekerByProfileId,
  listAdminSeekers,
  parseAdminSeekerFilters,
  uniqueAdminSeekerCities,
} from "./seekers.repository.js";

export const adminSeekersRouter = Router();

adminSeekersRouter.use(requireAuth, requireAdmin);

adminSeekersRouter.get("/", async (req, res, next) => {
  try {
    const filters = parseAdminSeekerFilters(
      req.query as Record<string, unknown>,
    );
    const [seekers, cities] = await Promise.all([
      listAdminSeekers(filters),
      uniqueAdminSeekerCities(),
    ]);
    res.json({ data: { seekers, cities, filters } });
  } catch (error) {
    next(error);
  }
});

adminSeekersRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isUuid(id)) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const profile =
      (await findProfileById(id)) ?? (await findProfileByUserId(id));
    if (!profile) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

adminSeekersRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isUuid(id)) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const deleted = await deleteAdminSeekerByProfileId(id);
    if (!deleted) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    res.json({ data: { id, deleted: true } });
  } catch (error) {
    next(error);
  }
});
