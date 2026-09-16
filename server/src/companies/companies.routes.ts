import { Router } from "express";
import { findCompanyById } from "./companies.repository.js";

export const companiesRouter = Router();

companiesRouter.get("/:id", async (req, res, next) => {
  try {
    const company = await findCompanyById(req.params.id);
    if (!company) {
      res.status(404).json({ error: "Perusahaan tidak ditemukan." });
      return;
    }
    res.json({ data: company });
  } catch (error) {
    next(error);
  }
});
