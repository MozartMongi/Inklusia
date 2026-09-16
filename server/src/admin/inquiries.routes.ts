import { Router } from "express";
import { authUser, requireAdmin, requireAuth } from "../auth/middleware.js";
import {
  isInquiryReviewDecision,
  isInquiryStatus,
} from "../db/inquiry-schema.js";
import {
  findAdminInquiry,
  listAdminInquiries,
  reviewCompanyInquiry,
} from "./inquiries.repository.js";

export const adminInquiriesRouter = Router();

adminInquiriesRouter.use(requireAuth, requireAdmin);

const MAX_REVIEW_NOTE_LENGTH = 500;

adminInquiriesRouter.get("/", async (req, res, next) => {
  try {
    const raw = typeof req.query.status === "string" ? req.query.status : "";
    const status = isInquiryStatus(raw) ? raw : "semua";
    const inquiries = await listAdminInquiries(status);
    res.json({ data: { inquiries, status } });
  } catch (error) {
    next(error);
  }
});

adminInquiriesRouter.get("/:id", async (req, res, next) => {
  try {
    const inquiry = await findAdminInquiry(req.params.id);
    if (!inquiry) {
      res.status(404).json({ error: "Kebutuhan tidak ditemukan." });
      return;
    }
    res.json({ data: inquiry });
  } catch (error) {
    next(error);
  }
});

/** Keputusan admin: menyetujui menerbitkan lowongan, menolak mencabutnya. */
adminInquiriesRouter.patch("/:id/tinjau", async (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};

    const decision = typeof body.keputusan === "string" ? body.keputusan : "";
    if (!isInquiryReviewDecision(decision)) {
      res.status(400).json({
        error: "Keputusan tinjauan tidak valid.",
        errors: { keputusan: "Pilih 'disetujui' atau 'ditolak'." },
      });
      return;
    }

    const reviewNote =
      typeof body.catatan === "string" ? body.catatan.trim() : "";
    if (reviewNote.length > MAX_REVIEW_NOTE_LENGTH) {
      res.status(400).json({
        error: "Catatan tinjauan terlalu panjang.",
        errors: {
          catatan: `Catatan maksimal ${MAX_REVIEW_NOTE_LENGTH} karakter.`,
        },
      });
      return;
    }

    // Penolakan tanpa alasan menyulitkan perusahaan memperbaiki kebutuhannya.
    if (decision === "ditolak" && !reviewNote) {
      res.status(400).json({
        error: "Alasan penolakan wajib diisi.",
        errors: { catatan: "Tuliskan alasan penolakan untuk perusahaan." },
      });
      return;
    }

    const result = await reviewCompanyInquiry({
      inquiryId: req.params.id,
      decision,
      reviewNote,
      reviewerUserId: authUser(req).id,
    });

    if (!result.ok) {
      const status = result.reason === "sudah_ditutup" ? 409 : 404;
      res.status(status).json({
        error:
          result.reason === "sudah_ditutup"
            ? "Kebutuhan sudah ditutup perusahaan dan tidak bisa ditinjau."
            : "Kebutuhan tidak ditemukan.",
      });
      return;
    }

    res.json({ data: result.inquiry });
  } catch (error) {
    next(error);
  }
});
