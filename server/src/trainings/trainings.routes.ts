import { Router } from "express";
import {
  findPublishedTrainingById,
  listPublishedTrainings,
} from "./trainings.repository.js";

export const trainingsRouter = Router();

/**
 * GET /api/pelatihan → { data: Training[] }
 */
trainingsRouter.get("/", async (_req, res, next) => {
  try {
    const data = await listPublishedTrainings();
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/pelatihan/:id → { data: Training }
 */
trainingsRouter.get("/:id", async (req, res, next) => {
  try {
    const training = await findPublishedTrainingById(req.params.id);
    if (!training) {
      res.status(404).json({ error: "Pelatihan tidak ditemukan." });
      return;
    }
    res.json({ data: training });
  } catch (error) {
    next(error);
  }
});
