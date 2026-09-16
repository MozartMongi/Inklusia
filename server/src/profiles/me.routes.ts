import type { NextFunction, Request, Response, Router as RouterType } from "express";
import { Router } from "express";
import { requireAuth, requireJobSeeker } from "../auth/middleware.js";
import type { JobSeekerPhotoKind } from "../db/job-seeker-schema.js";
import { currentUserId } from "./current-user.js";
import { computeProfileCompleteness } from "./completeness.js";
import { handleProfileImageUpload } from "./photo-upload.js";
import { saveProfileImage } from "./photo-storage.js";
import {
  findProfileByUserId,
  findProfileIdByUserId,
  createSkill,
  updateSkill,
  deleteSkill,
  createExperience,
  updateExperience,
  deleteExperience,
  updateProfileIdentity,
  upsertProfilePhoto,
} from "./profiles.repository.js";
import {
  parseIdentityBody,
  validateIdentityInput,
} from "./identity.js";
import {
  experienceEndDate,
  parseExperienceBody,
  validateExperienceInput,
} from "./experiences.js";
import {
  parseSkillBody,
  parseSkillPatchBody,
  validateSkillInput,
} from "./skills.js";

export const meRouter: RouterType = Router();

meRouter.use(requireAuth, requireJobSeeker);

meRouter.get("/profile", async (req, res, next) => {
  try {
    const profile = await findProfileByUserId(currentUserId(req));
    if (!profile) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

meRouter.get("/profile/completeness", async (req, res, next) => {
  try {
    const profile = await findProfileByUserId(currentUserId(req));
    if (!profile) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }
    res.json({ data: computeProfileCompleteness(profile) });
  } catch (error) {
    next(error);
  }
});

meRouter.patch("/profile", async (req, res, next) => {
  try {
    const values = parseIdentityBody(req.body);
    const errors = validateIdentityInput(values);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: "Data diri belum lengkap.", errors });
      return;
    }

    if (!values.disabilityType) {
      res.status(400).json({
        error: "Data diri belum lengkap.",
        errors: { disabilityType: "Jenis disabilitas wajib dipilih." },
      });
      return;
    }

    const profile = await updateProfileIdentity(currentUserId(req), {
      ...values,
      disabilityType: values.disabilityType,
    });
    if (!profile) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

meRouter.post("/profile/photo", handleProfileImageUpload, (req, res, next) => {
  void uploadProfileImage(req, res, next, "photo");
});

meRouter.post("/profile/ktp", handleProfileImageUpload, (req, res, next) => {
  void uploadProfileImage(req, res, next, "ktp");
});

async function uploadProfileImage(
  req: Request,
  res: Response,
  next: NextFunction,
  kind: JobSeekerPhotoKind,
) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Berkas gambar wajib diunggah." });
      return;
    }

    const profileId = await findProfileIdByUserId(currentUserId(req));
    if (!profileId) {
      res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
      return;
    }

    const url = await saveProfileImage({
      profileId,
      kind,
      mimeType: req.file.mimetype,
      buffer: req.file.buffer,
    });
    await upsertProfilePhoto(profileId, kind, url);

    const profile = await findProfileByUserId(currentUserId(req));
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
}

async function requireProfileId(req: Request, res: Response) {
  const profileId = await findProfileIdByUserId(currentUserId(req));
  if (!profileId) {
    res.status(404).json({ error: "Profil pencari kerja tidak ditemukan." });
    return null;
  }
  return profileId;
}

meRouter.post("/profile/skills", async (req, res, next) => {
  try {
    const values = parseSkillBody(req.body);
    const errors = validateSkillInput(values);
    if (Object.keys(errors).length > 0 || !values.level) {
      res.status(400).json({ error: "Data keahlian belum lengkap.", errors });
      return;
    }

    const profileId = await requireProfileId(req, res);
    if (!profileId) {
      return;
    }

    const created = await createSkill(profileId, {
      skillName: values.skillName,
      level: values.level,
    });
    if (created === "duplicate") {
      res.status(409).json({
        error: "Keahlian ini sudah ada dalam daftar.",
        errors: { skillName: "Keahlian ini sudah ada dalam daftar." },
      });
      return;
    }

    const profile = await findProfileByUserId(currentUserId(req));
    res.status(201).json({ data: profile });
  } catch (error) {
    next(error);
  }
});

meRouter.patch("/profile/skills/:id", async (req, res, next) => {
  try {
    const patch = parseSkillPatchBody(req.body);
    if (patch.skillName !== undefined && !patch.skillName.trim()) {
      res.status(400).json({
        error: "Data keahlian belum lengkap.",
        errors: { skillName: "Nama keahlian wajib diisi." },
      });
      return;
    }
    if (patch.level !== undefined && !patch.level) {
      res.status(400).json({
        error: "Data keahlian belum lengkap.",
        errors: { level: "Tingkat kemahiran wajib dipilih." },
      });
      return;
    }

    const profileId = await requireProfileId(req, res);
    if (!profileId) {
      return;
    }

    const updated = await updateSkill(profileId, req.params.id, {
      skillName: patch.skillName,
      level: patch.level || undefined,
    });
    if (updated === "missing") {
      res.status(404).json({ error: "Keahlian tidak ditemukan." });
      return;
    }
    if (updated === "duplicate") {
      res.status(409).json({
        error: "Keahlian ini sudah ada dalam daftar.",
        errors: { skillName: "Keahlian ini sudah ada dalam daftar." },
      });
      return;
    }

    const profile = await findProfileByUserId(currentUserId(req));
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

meRouter.delete("/profile/skills/:id", async (req, res, next) => {
  try {
    const profileId = await requireProfileId(req, res);
    if (!profileId) {
      return;
    }

    const removed = await deleteSkill(profileId, req.params.id);
    if (!removed) {
      res.status(404).json({ error: "Keahlian tidak ditemukan." });
      return;
    }

    const profile = await findProfileByUserId(currentUserId(req));
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

meRouter.post("/profile/experiences", async (req, res, next) => {
  try {
    const values = parseExperienceBody(req.body);
    const errors = validateExperienceInput(values);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        error: "Data pengalaman kerja belum lengkap.",
        errors,
      });
      return;
    }

    const profileId = await requireProfileId(req, res);
    if (!profileId) {
      return;
    }

    await createExperience(profileId, {
      companyName: values.companyName,
      position: values.position,
      startDate: values.startDate,
      endDate: experienceEndDate(values),
      description: values.description,
    });

    const profile = await findProfileByUserId(currentUserId(req));
    res.status(201).json({ data: profile });
  } catch (error) {
    next(error);
  }
});

meRouter.patch("/profile/experiences/:id", async (req, res, next) => {
  try {
    const values = parseExperienceBody(req.body);
    const errors = validateExperienceInput(values);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        error: "Data pengalaman kerja belum lengkap.",
        errors,
      });
      return;
    }

    const profileId = await requireProfileId(req, res);
    if (!profileId) {
      return;
    }

    const updated = await updateExperience(profileId, req.params.id, {
      companyName: values.companyName,
      position: values.position,
      startDate: values.startDate,
      endDate: experienceEndDate(values),
      description: values.description,
    });
    if (!updated) {
      res.status(404).json({ error: "Pengalaman kerja tidak ditemukan." });
      return;
    }

    const profile = await findProfileByUserId(currentUserId(req));
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});

meRouter.delete("/profile/experiences/:id", async (req, res, next) => {
  try {
    const profileId = await requireProfileId(req, res);
    if (!profileId) {
      return;
    }

    const removed = await deleteExperience(profileId, req.params.id);
    if (!removed) {
      res.status(404).json({ error: "Pengalaman kerja tidak ditemukan." });
      return;
    }

    const profile = await findProfileByUserId(currentUserId(req));
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
});
