import { Router } from "express";
import { authUser, requireAuth, requireCompany } from "../auth/middleware.js";
import { findCompanyByUserId } from "../companies/companies.repository.js";
import { findProfileById } from "../profiles/profiles.repository.js";
import { listPlacementsForCompany } from "./placements.repository.js";
import { toSeekerSummary } from "./seeker-summary.js";

export const companyKandidatRouter = Router();

companyKandidatRouter.use(requireAuth, requireCompany);

companyKandidatRouter.get("/", async (req, res, next) => {
  try {
    const company = await findCompanyByUserId(authUser(req).id);
    if (!company) {
      res.status(404).json({ error: "Profil perusahaan tidak ditemukan." });
      return;
    }

    const placements = await listPlacementsForCompany(company.id);
    const uniqueSeekerIds = [...new Set(placements.map((item) => item.jobSeeker.id))];
    const seekers = await Promise.all(
      uniqueSeekerIds.map((id) => findProfileById(id)),
    );
    const seekerById = new Map(
      seekers
        .filter((profile) => profile !== null)
        .map((profile) => [profile.id, toSeekerSummary(profile)]),
    );

    res.json({
      data: placements.map((placement) => ({
        placement,
        seeker: seekerById.get(placement.jobSeeker.id) ?? null,
      })),
    });
  } catch (error) {
    next(error);
  }
});
