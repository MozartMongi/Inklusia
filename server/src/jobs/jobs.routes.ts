import { Router } from "express";
import {
  DISABILITY_FILTER_OPTIONS,
  JOB_TYPE_FILTER_OPTIONS,
} from "../db/jobs-schema.js";
import { parseJobListFilters } from "./filters.js";
import {
  findActiveJobById,
  listActiveJobLocations,
  listActiveJobs,
} from "./jobs.repository.js";

export const jobsRouter = Router();

jobsRouter.get("/filters", async (_req, res, next) => {
  try {
    const lokasi = await listActiveJobLocations();
    res.json({
      data: {
        lokasi,
        disabilitas: DISABILITY_FILTER_OPTIONS,
        jenis: JOB_TYPE_FILTER_OPTIONS,
      },
    });
  } catch (error) {
    next(error);
  }
});

jobsRouter.get("/", async (req, res, next) => {
  try {
    const filters = parseJobListFilters(req.query);
    const data = await listActiveJobs(filters);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

jobsRouter.get("/:id", async (req, res, next) => {
  try {
    const job = await findActiveJobById(req.params.id);
    if (!job) {
      res.status(404).json({ error: "Lowongan tidak ditemukan." });
      return;
    }
    res.json({ data: job });
  } catch (error) {
    next(error);
  }
});
