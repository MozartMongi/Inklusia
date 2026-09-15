import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth/middleware.js";
import { fetchAdminDashboardSummary } from "./summary.repository.js";

export const adminSummaryRouter = Router();

adminSummaryRouter.use(requireAuth, requireAdmin);

/**
 * GET /api/admin/ringkasan → { data: AdminDashboardSummary }
 */
adminSummaryRouter.get("/", async (_req, res, next) => {
  try {
    const data = await fetchAdminDashboardSummary();
    res.json({ data });
  } catch (error) {
    next(error);
  }
});
