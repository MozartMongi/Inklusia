import { Router } from "express";
import { requireAdmin, requireAuth } from "../auth/middleware.js";
import {
  findAdminCompanyProfile,
  listAdminCompanies,
  parseAdminCompanyFilters,
  uniqueAdminCompanyFacets,
} from "./companies.repository.js";

export const adminCompaniesRouter = Router();

adminCompaniesRouter.use(requireAuth, requireAdmin);

adminCompaniesRouter.get("/", async (req, res, next) => {
  try {
    const filters = parseAdminCompanyFilters(
      req.query as Record<string, unknown>,
    );
    const [companies, facets] = await Promise.all([
      listAdminCompanies(filters),
      uniqueAdminCompanyFacets(),
    ]);
    res.json({
      data: {
        companies,
        cities: facets.cities,
        industries: facets.industries,
        filters,
      },
    });
  } catch (error) {
    next(error);
  }
});

adminCompaniesRouter.get("/:id/inquiry", async (req, res, next) => {
  try {
    const profile = await findAdminCompanyProfile(req.params.id);
    if (!profile) {
      res.status(404).json({ error: "Perusahaan tidak ditemukan." });
      return;
    }
    res.json({ data: profile.inquiries });
  } catch (error) {
    next(error);
  }
});

adminCompaniesRouter.get("/:id", async (req, res, next) => {
  try {
    const profile = await findAdminCompanyProfile(req.params.id);
    if (!profile) {
      res.status(404).json({ error: "Perusahaan tidak ditemukan." });
      return;
    }
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});
