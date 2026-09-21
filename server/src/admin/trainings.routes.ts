import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth/middleware.js";
import { isUuid } from "../db/ids.js";
import {
  createAdminTraining,
  findAdminTrainingById,
  listAdminTrainings,
  parseCreateAdminTrainingInput,
} from "./trainings.repository.js";

export const adminTrainingsRouter = Router();

adminTrainingsRouter.use(requireAuth, requireAdmin);

/**
 * GET /api/admin/pelatihan → { data: AdminTraining[] }
 */
adminTrainingsRouter.get("/", async (_req, res, next) => {
  try {
    const data = await listAdminTrainings();
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/pelatihan → { data: AdminTraining }
 */
adminTrainingsRouter.post("/", async (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};
    const parsed = parseCreateAdminTrainingInput(body);
    if ("errors" in parsed) {
      res.status(400).json({
        error: "Data pelatihan belum lengkap.",
        errors: parsed.errors,
      });
      return;
    }

    const data = await createAdminTraining(parsed.data);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/pelatihan/:id → { data: AdminTrainingDetail }
 */
adminTrainingsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!isUuid(id)) {
      res.status(404).json({ error: "Pelatihan tidak ditemukan." });
      return;
    }

    const data = await findAdminTrainingById(id);
    if (!data) {
      res.status(404).json({ error: "Pelatihan tidak ditemukan." });
      return;
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
});
