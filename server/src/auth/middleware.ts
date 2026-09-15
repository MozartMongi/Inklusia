import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./jwt.js";
import { findUserById, type AuthUser, type UserRole } from "./users.repository.js";

export type AuthedRequest = Request & { user: AuthUser };

function bearerToken(req: Request): string | null {
  const header = req.header("authorization");
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token.trim() || null;
}

export function authUser(req: Request): AuthUser {
  const user = (req as AuthedRequest).user;
  if (!user) {
    throw new Error("Middleware requireAuth harus dipasang sebelum handler ini.");
  }
  return user;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  void (async () => {
    try {
      const token = bearerToken(req);
      if (!token) {
        res.status(401).json({ error: "Anda perlu masuk terlebih dahulu." });
        return;
      }

      const verified = verifyAccessToken(token);
      if (!verified) {
        res.status(401).json({ error: "Sesi tidak valid atau sudah kedaluwarsa." });
        return;
      }

      const user = await findUserById(verified.userId);
      if (!user) {
        res.status(401).json({ error: "Sesi tidak valid atau sudah kedaluwarsa." });
        return;
      }
      if (user.status === "nonaktif") {
        res.status(403).json({ error: "Akun Anda telah dinonaktifkan." });
        return;
      }

      (req as AuthedRequest).user = user;
      next();
    } catch (error) {
      next(error);
    }
  })();
}

function requireRole(role: UserRole, message: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = authUser(req);
    if (user.role !== role) {
      res.status(403).json({ error: message });
      return;
    }
    next();
  };
}

export const requireJobSeeker = requireRole(
  "job_seeker",
  "Hanya pencari kerja yang dapat mengakses profil ini.",
);

export const requireCompany = requireRole(
  "company",
  "Hanya perusahaan yang dapat mengakses data ini.",
);

export const requireAdmin = requireRole(
  "admin",
  "Hanya admin yang dapat mengakses data ini.",
);

/** Admin biasa + root: role harus admin. Root saja: isRootAdmin true. */
export function requireRootAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = authUser(req);
  if (user.role !== "admin") {
    res.status(403).json({ error: "Hanya admin yang dapat mengakses data ini." });
    return;
  }
  if (!user.isRootAdmin) {
    res.status(403).json({
      error: "Hanya root admin yang dapat mengelola akun admin.",
    });
    return;
  }
  next();
}
