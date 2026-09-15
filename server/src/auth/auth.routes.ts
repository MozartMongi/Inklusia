import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import {
  authUser,
  requireAuth,
  requireAdmin,
  requireRootAdmin,
  requireCompany,
  requireJobSeeker,
} from "./middleware.js";
import { signAccessToken } from "./jwt.js";
import { verifyPassword } from "./password.js";
import { registerCompanyAccount } from "./register-company.service.js";
import {
  parseRegisterCompanyBody,
  validateRegisterCompanyInput,
} from "./register-company.js";
import { registerJobSeekerAccount } from "./register-seeker.service.js";
import {
  parseRegisterSeekerBody,
  validateRegisterSeekerInput,
} from "./register-seeker.js";
import { redirectPathForRole, toApiRole } from "./roles.js";
import { findUserByEmail } from "./users.repository.js";
import {
  confirmPasswordReset,
  requestPasswordReset,
} from "./password-reset.js";
import { currentUserId } from "../profiles/current-user.js";
import {
  handleProfileImageUpload,
} from "../profiles/photo-upload.js";
import { saveProfileImage } from "../profiles/photo-storage.js";
import {
  findProfileByUserId,
  findProfileIdByUserId,
  upsertProfilePhoto,
} from "../profiles/profiles.repository.js";
import type { JobSeekerPhotoKind } from "../db/job-seeker-schema.js";

export const authRouter = Router();

authRouter.post("/register/pencari-kerja", async (req, res, next) => {
  try {
    const { values } = parseRegisterSeekerBody(req.body);
    const errors = validateRegisterSeekerInput(values);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        error: "Data pendaftaran pencari kerja belum lengkap.",
        errors,
      });
      return;
    }

    if (!values.disabilityType) {
      res.status(400).json({
        error: "Data pendaftaran pencari kerja belum lengkap.",
        errors: { disabilityType: "Jenis disabilitas wajib dipilih." },
      });
      return;
    }

    const result = await registerJobSeekerAccount({
      ...values,
      disabilityType: values.disabilityType,
    });

    if ("conflict" in result) {
      res.status(409).json({
        error: "Email sudah terdaftar.",
        errors: { email: "Email sudah terdaftar." },
      });
      return;
    }

    res.status(201).json({
      data: {
        id: result.user.id,
        email: result.user.email,
        role: toApiRole(result.user.role),
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register/perusahaan", async (req, res, next) => {
  try {
    const { values } = parseRegisterCompanyBody(req.body);
    const errors = validateRegisterCompanyInput(values);
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        error: "Data pendaftaran perusahaan belum lengkap.",
        errors,
      });
      return;
    }

    if (
      !values.hasDisabilityEmployees ||
      !values.hasCsrOrGrant ||
      values.disabilityWorkersNeeded === null
    ) {
      res.status(400).json({
        error: "Data pendaftaran perusahaan belum lengkap.",
        errors,
      });
      return;
    }

    const result = await registerCompanyAccount({
      ...values,
      hasDisabilityEmployees: values.hasDisabilityEmployees,
      hasCsrOrGrant: values.hasCsrOrGrant,
      disabilityWorkersNeeded: values.disabilityWorkersNeeded,
      disabilityHirePlan:
        values.hasDisabilityEmployees === "tidak"
          ? values.disabilityHirePlan
          : null,
    });

    if ("conflict" in result) {
      res.status(409).json({
        error: "Email sudah terdaftar.",
        errors: { contactEmail: "Email sudah terdaftar." },
      });
      return;
    }

    res.status(201).json({
      data: {
        id: result.user.id,
        email: result.user.email,
        role: toApiRole(result.user.role),
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      res.status(400).json({
        error: "Email dan kata sandi wajib diisi.",
        errors: {
          email: !email ? "Email wajib diisi." : undefined,
          password: !password ? "Kata sandi wajib diisi." : undefined,
        },
      });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: "Email atau kata sandi tidak sesuai." });
      return;
    }
    if (user.status === "nonaktif") {
      res.status(403).json({ error: "Akun Anda telah dinonaktifkan." });
      return;
    }

    const token = signAccessToken(user);
    res.json({
      data: {
        id: user.id,
        email: user.email,
        role: toApiRole(user.role),
        redirectTo: redirectPathForRole(user.role),
        accessToken: token,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", requireAuth, (_req, res) => {
  res.json({ data: { ok: true } });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const user = authUser(req);
  res.json({
    data: {
      id: user.id,
      email: user.email,
      role: toApiRole(user.role),
      redirectTo: redirectPathForRole(user.role),
    },
  });
});

/** Endpoint uji proteksi peran (dokumentasi kontrak). */
authRouter.get("/guard/pencari-kerja", requireAuth, requireJobSeeker, (_req, res) => {
  res.json({ data: { ok: true, role: "pencari_kerja" } });
});

authRouter.get("/guard/perusahaan", requireAuth, requireCompany, (_req, res) => {
  res.json({ data: { ok: true, role: "perusahaan" } });
});

authRouter.get("/guard/admin", requireAuth, requireAdmin, (req, res) => {
  const user = authUser(req);
  res.json({
    data: {
      ok: true,
      role: "admin",
      isRootAdmin: user.isRootAdmin,
    },
  });
});

authRouter.get("/guard/root-admin", requireAuth, requireRootAdmin, (req, res) => {
  const user = authUser(req);
  res.json({
    data: {
      ok: true,
      role: "admin",
      isRootAdmin: user.isRootAdmin,
    },
  });
});

authRouter.post("/lupa-kata-sandi", async (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!email) {
      res.status(400).json({
        error: "Email wajib diisi.",
        errors: { email: "Email wajib diisi." },
      });
      return;
    }

    const result = await requestPasswordReset(email);
    res.json({
      data: {
        sent: true as const,
        ...(result.debugToken ? { debugToken: result.debugToken } : {}),
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/reset-kata-sandi", async (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";

    const result = await confirmPasswordReset({ token, password });
    if ("error" in result) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.json({ data: { reset: true as const } });
  } catch (error) {
    next(error);
  }
});

authRouter.post(
  "/unggah/foto-diri",
  requireAuth,
  requireJobSeeker,
  handleProfileImageUpload,
  (req, res, next) => {
    void uploadAuthProfileImage(req, res, next, "photo");
  },
);

authRouter.post(
  "/unggah/foto-ktp",
  requireAuth,
  requireJobSeeker,
  handleProfileImageUpload,
  (req, res, next) => {
    void uploadAuthProfileImage(req, res, next, "ktp");
  },
);

async function uploadAuthProfileImage(
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
