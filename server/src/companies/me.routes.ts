import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { requireAuth, requireCompany } from "../auth/middleware.js";
import { currentUserId } from "../profiles/current-user.js";
import {
  findCompanyByUserId,
  findCompanyProfileByUserId,
  updateCompanyProfileByUserId,
} from "./companies.repository.js";
import {
  createCompanyInquiry,
  findCompanyInquiryForCompany,
  listCompanyInquiries,
  updateCompanyInquiryForCompany,
  updateCompanyInquiryStatusForCompany,
} from "./inquiries.repository.js";
import {
  parseInquiryBody,
  toCreateInquiryInput,
  validateInquiryInput,
} from "./inquiry-input.js";
import {
  hasCompanyProfileErrors,
  parseCompanyProfileBody,
  validateCompanyProfileInput,
} from "./profile-input.js";

/**
 * Ruang perusahaan di bawah /api/me/company.
 * Middleware role dipasang sekali di router agar semua endpoint terlindungi.
 */
export const meCompanyRouter = Router();

meCompanyRouter.use(requireAuth, requireCompany);

meCompanyRouter.get("/", async (req, res, next) => {
  try {
    const profile = await findCompanyProfileByUserId(currentUserId(req));
    if (!profile) {
      res.status(404).json({ error: "Profil perusahaan tidak ditemukan." });
      return;
    }
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

async function updateCompanyProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const values = parseCompanyProfileBody(req.body);
    const errors = validateCompanyProfileInput(values);
    if (hasCompanyProfileErrors(errors)) {
      res.status(400).json({
        error: "Data profil perusahaan belum lengkap.",
        errors,
      });
      return;
    }

    const profile = await updateCompanyProfileByUserId(
      currentUserId(req),
      values,
    );
    if (!profile) {
      res.status(404).json({ error: "Profil perusahaan tidak ditemukan." });
      return;
    }
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
}

meCompanyRouter.put("/", updateCompanyProfileHandler);
meCompanyRouter.patch("/", updateCompanyProfileHandler);

meCompanyRouter.get("/inquiries/:id", async (req, res, next) => {
  try {
    const company = await findCompanyByUserId(currentUserId(req));
    if (!company) {
      res.status(404).json({ error: "Profil perusahaan tidak ditemukan." });
      return;
    }

    const inquiry = await findCompanyInquiryForCompany(
      company.id,
      req.params.id,
    );
    if (!inquiry) {
      res.status(404).json({ error: "Inquiry tidak ditemukan." });
      return;
    }

    res.json({ data: inquiry });
  } catch (error) {
    next(error);
  }
});

meCompanyRouter.get("/inquiries", async (req, res, next) => {
  try {
    const company = await findCompanyByUserId(currentUserId(req));
    if (!company) {
      res.status(404).json({ error: "Profil perusahaan tidak ditemukan." });
      return;
    }

    const inquiries = await listCompanyInquiries(company.id);
    res.json({ data: inquiries });
  } catch (error) {
    next(error);
  }
});

meCompanyRouter.post("/inquiries", async (req, res, next) => {
  try {
    const company = await findCompanyByUserId(currentUserId(req));
    if (!company) {
      res.status(404).json({ error: "Profil perusahaan tidak ditemukan." });
      return;
    }

    const values = parseInquiryBody(req.body);
    const errors = validateInquiryInput(values);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        error: "Data inquiry belum lengkap.",
        errors,
      });
      return;
    }

    const input = toCreateInquiryInput(values);
    if (!input) {
      res.status(400).json({
        error: "Data inquiry belum lengkap.",
        errors: validateInquiryInput(values),
      });
      return;
    }

    const inquiry = await createCompanyInquiry(company.id, input);
    if (!inquiry) {
      res.status(500).json({ error: "Inquiry gagal dibuat." });
      return;
    }

    res.status(201).json({ data: inquiry });
  } catch (error) {
    next(error);
  }
});

meCompanyRouter.patch("/inquiries/:id", async (req, res, next) => {
  try {
    const company = await findCompanyByUserId(currentUserId(req));
    if (!company) {
      res.status(404).json({ error: "Profil perusahaan tidak ditemukan." });
      return;
    }

    const values = parseInquiryBody(req.body);
    const errors = validateInquiryInput(values);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        error: "Data inquiry belum lengkap.",
        errors,
      });
      return;
    }

    const input = toCreateInquiryInput(values);
    if (!input) {
      res.status(400).json({
        error: "Data inquiry belum lengkap.",
        errors: validateInquiryInput(values),
      });
      return;
    }

    const inquiry = await updateCompanyInquiryForCompany(
      company.id,
      req.params.id,
      input,
    );
    if (!inquiry) {
      res.status(404).json({ error: "Inquiry tidak ditemukan." });
      return;
    }

    res.json({ data: inquiry });
  } catch (error) {
    next(error);
  }
});

meCompanyRouter.patch("/inquiries/:id/status", async (req, res, next) => {
  try {
    const company = await findCompanyByUserId(currentUserId(req));
    if (!company) {
      res.status(404).json({ error: "Profil perusahaan tidak ditemukan." });
      return;
    }

    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};
    const statusRaw = typeof body.status === "string" ? body.status : "";
    // Perusahaan hanya boleh menutup atau mengirim ulang untuk ditinjau;
    // status "disetujui"/"ditolak" adalah keputusan admin.
    if (statusRaw !== "menunggu" && statusRaw !== "ditutup") {
      res.status(400).json({
        error: "Status kebutuhan tidak valid.",
        errors: {
          status:
            "Status hanya bisa diubah menjadi 'ditutup' atau dikirim ulang sebagai 'menunggu'.",
        },
      });
      return;
    }

    const inquiry = await updateCompanyInquiryStatusForCompany(
      company.id,
      req.params.id,
      statusRaw,
    );
    if (!inquiry) {
      res.status(404).json({ error: "Inquiry tidak ditemukan." });
      return;
    }

    res.json({ data: inquiry });
  } catch (error) {
    next(error);
  }
});
