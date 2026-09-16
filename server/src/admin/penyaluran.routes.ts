import { Router } from "express";
import { authUser, requireAdmin, requireAuth } from "../auth/middleware.js";
import {
  listAdminSeekers,
  parseAdminSeekerFilters,
  uniqueAdminSeekerCities,
} from "./seekers.repository.js";
import { listPublishedJobsForPlacement, findActiveJobById } from "../jobs/jobs.repository.js";
import {
  findProfileById,
  findProfileByUserId,
} from "../profiles/profiles.repository.js";
import { parseForwardBody, validateForwardInput } from "../placements/forward.js";
import {
  parseContactLogBody,
  validateContactLogInput,
} from "../placements/contact.js";
import { parseStatusBody, validateStatusInput } from "../placements/status.js";
import {
  createContactLog,
  listContactLogsForProfile,
} from "../placements/contact-logs.repository.js";
import {
  createPlacement,
  listPlacements,
  updatePlacementStatus,
} from "../placements/placements.repository.js";
import { parsePlacementHistoryFilters } from "../placements/history-filters.js";

export const adminPenyaluranRouter = Router();

adminPenyaluranRouter.use(requireAuth, requireAdmin);

adminPenyaluranRouter.get("/", async (req, res, next) => {
  try {
    const filters = parseAdminSeekerFilters(
      req.query as Record<string, unknown>,
    );
    const pilih =
      typeof req.query.pilih === "string" ? req.query.pilih.trim() : "";
    const hasFilter = Boolean(
      filters.q || filters.disabilitas || filters.kota,
    );

    const [filteredSeekers, allSeekers, cities, openJobs, recentPlacements] =
      await Promise.all([
        hasFilter ? listAdminSeekers(filters) : Promise.resolve(null),
        listAdminSeekers({ q: "", disabilitas: "", kota: "" }),
        uniqueAdminSeekerCities(),
        listPublishedJobsForPlacement(),
        listPlacements({ q: "", status: "", perusahaan: "" }),
      ]);

    const seekers = filteredSeekers ?? allSeekers;
    const selectedSeeker = pilih
      ? (seekers.find((seeker) => seeker.id === pilih) ??
        allSeekers.find((seeker) => seeker.id === pilih) ??
        null)
      : null;
    const selectedContactLogs = selectedSeeker
      ? await listContactLogsForProfile(selectedSeeker.id)
      : [];

    const waitingCount = recentPlacements.filter(
      (placement) => placement.status === "menunggu",
    ).length;
    const sentCount = recentPlacements.filter(
      (placement) =>
        placement.status === "dikirim" || placement.status === "diterima",
    ).length;

    res.json({
      data: {
        seekers,
        selectedSeeker,
        selectedContactLogs,
        filters: {
          q: filters.q,
          disabilitas: filters.disabilitas,
          kota: filters.kota,
          pilih,
        },
        cities,
        openJobs,
        recentPlacements,
        stats: {
          seekerCount: allSeekers.length,
          openJobCount: openJobs.length,
          waitingCount,
          sentCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

adminPenyaluranRouter.post("/", async (req, res, next) => {
  try {
    const values = parseForwardBody(req.body);
    const errors = validateForwardInput(values);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        error: "Data penyaluran belum lengkap.",
        errors,
      });
      return;
    }

    const profile =
      (await findProfileById(values.jobSeekerId)) ??
      (await findProfileByUserId(values.jobSeekerId));
    if (!profile) {
      res.status(404).json({ error: "Pencari kerja tidak ditemukan." });
      return;
    }

    const job = await findActiveJobById(values.jobId);
    if (!job) {
      res.status(404).json({ error: "Lowongan tidak ditemukan atau sudah ditutup." });
      return;
    }

    const created = await createPlacement({
      profileId: profile.id,
      jobId: job.id,
      note: values.note,
      createdByUserId: authUser(req).id,
    });

    if (created === "duplicate") {
      res.status(409).json({
        error: "Kandidat ini sudah disalurkan ke lowongan tersebut.",
        errors: {
          jobId: "Kandidat ini sudah disalurkan ke lowongan tersebut.",
        },
      });
      return;
    }

    res.status(201).json({ data: created });
  } catch (error) {
    next(error);
  }
});

adminPenyaluranRouter.get("/kontak", async (req, res, next) => {
  try {
    const jobSeekerId =
      typeof req.query.jobSeekerId === "string" ? req.query.jobSeekerId.trim() : "";
    if (!jobSeekerId) {
      res.status(400).json({
        error: "Pilih pencari kerja yang akan dihubungi.",
        errors: { jobSeekerId: "Pilih pencari kerja yang akan dihubungi." },
      });
      return;
    }

    const profile =
      (await findProfileById(jobSeekerId)) ??
      (await findProfileByUserId(jobSeekerId));
    if (!profile) {
      res.status(404).json({ error: "Pencari kerja tidak ditemukan." });
      return;
    }

    const data = await listContactLogsForProfile(profile.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

adminPenyaluranRouter.get("/riwayat", async (req, res, next) => {
  try {
    const filters = parsePlacementHistoryFilters(req.query);
    const data = await listPlacements(filters);
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

adminPenyaluranRouter.post("/kontak", async (req, res, next) => {
  try {
    const values = parseContactLogBody(req.body);
    const errors = validateContactLogInput(values);
    if (Object.keys(errors).length > 0 || !values.channel) {
      res.status(400).json({
        error: "Data kontak belum lengkap.",
        errors,
      });
      return;
    }

    const profile =
      (await findProfileById(values.jobSeekerId)) ??
      (await findProfileByUserId(values.jobSeekerId));
    if (!profile) {
      res.status(404).json({ error: "Pencari kerja tidak ditemukan." });
      return;
    }

    const created = await createContactLog({
      profileId: profile.id,
      channel: values.channel,
      message: values.message,
      createdByUserId: authUser(req).id,
    });

    res.status(201).json({ data: created });
  } catch (error) {
    next(error);
  }
});

adminPenyaluranRouter.patch("/:id", async (req, res, next) => {
  try {
    const values = parseStatusBody(req.body);
    const errors = validateStatusInput(values);
    if (Object.keys(errors).length > 0 || !values.status) {
      res.status(400).json({
        error: "Status penyaluran belum lengkap.",
        errors,
      });
      return;
    }

    const updated = await updatePlacementStatus(req.params.id, values.status);
    if (!updated) {
      res.status(404).json({ error: "Penyaluran tidak ditemukan." });
      return;
    }

    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
});
