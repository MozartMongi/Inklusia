import { Router } from "express";
import { requireAuth, requireRootAdmin } from "../auth/middleware.js";
import {
  createAdminAccount,
  findAdminAccountById,
  listAdminAccounts,
  setAdminAccountStatus,
  updateAdminAccount,
} from "./accounts.repository.js";

export const adminAccountsRouter = Router();

adminAccountsRouter.use(requireAuth, requireRootAdmin);

adminAccountsRouter.get("/", async (_req, res, next) => {
  try {
    const data = await listAdminAccounts();
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

adminAccountsRouter.get("/:id", async (req, res, next) => {
  try {
    const account = await findAdminAccountById(req.params.id);
    if (!account) {
      res.status(404).json({ error: "Akun admin tidak ditemukan." });
      return;
    }
    res.json({ data: account });
  } catch (error) {
    next(error);
  }
});

adminAccountsRouter.post("/", async (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};
    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    const errors: Record<string, string> = {};
    if (!fullName) {
      errors.fullName = "Nama lengkap wajib diisi.";
    }
    if (!email) {
      errors.email = "Email wajib diisi.";
    }
    if (!password || password.length < 8) {
      errors.password = "Kata sandi minimal 8 karakter.";
    }
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: "Data akun belum lengkap.", errors });
      return;
    }

    const result = await createAdminAccount({ fullName, email, password });
    if ("error" in result) {
      res.status(409).json({ error: result.error });
      return;
    }

    res.status(201).json({ data: result.data });
  } catch (error) {
    next(error);
  }
});

adminAccountsRouter.put("/:id", async (req, res, next) => {
  try {
    const body =
      req.body && typeof req.body === "object"
        ? (req.body as Record<string, unknown>)
        : {};
    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password =
      typeof body.password === "string" ? body.password.trim() : "";

    const errors: Record<string, string> = {};
    if (!fullName) {
      errors.fullName = "Nama lengkap wajib diisi.";
    }
    if (!email) {
      errors.email = "Email wajib diisi.";
    }
    if (password && password.length < 8) {
      errors.password = "Kata sandi minimal 8 karakter.";
    }
    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: "Data akun belum lengkap.", errors });
      return;
    }

    const result = await updateAdminAccount(req.params.id, {
      fullName,
      email,
      password: password || undefined,
    });
    if (result === null) {
      res.status(404).json({ error: "Akun admin tidak ditemukan." });
      return;
    }
    if ("error" in result) {
      res.status(409).json({ error: result.error });
      return;
    }

    res.json({ data: result.data });
  } catch (error) {
    next(error);
  }
});

adminAccountsRouter.post("/:id/nonaktifkan", async (req, res, next) => {
  try {
    const result = await setAdminAccountStatus(req.params.id, "nonaktif");
    if (result === null) {
      res.status(404).json({ error: "Akun admin tidak ditemukan." });
      return;
    }
    if ("error" in result) {
      res.status(409).json({ error: result.error });
      return;
    }
    res.json({ data: result.data });
  } catch (error) {
    next(error);
  }
});

adminAccountsRouter.post("/:id/aktifkan", async (req, res, next) => {
  try {
    const result = await setAdminAccountStatus(req.params.id, "aktif");
    if (result === null) {
      res.status(404).json({ error: "Akun admin tidak ditemukan." });
      return;
    }
    if ("error" in result) {
      res.status(409).json({ error: result.error });
      return;
    }
    res.json({ data: result.data });
  } catch (error) {
    next(error);
  }
});
