import { Router } from "express";
import { CV_LAYOUT } from "../db/cv-schema.js";

export const cvLayoutRouter = Router();

cvLayoutRouter.get("/template", (_req, res) => {
  res.json({ data: CV_LAYOUT });
});
