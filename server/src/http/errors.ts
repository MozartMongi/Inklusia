import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { isProduction } from "../config/env.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.path} tidak ditemukan.` });
}

/**
 * Satu-satunya tempat error berubah jadi respons. Detail internal
 * hanya ikut terkirim di luar production supaya tidak bocor ke klien.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Ukuran berkas melebihi batas yang diizinkan."
        : "Berkas yang diunggah tidak valid.";
    res.status(400).json({ error: message });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "Format JSON pada permintaan tidak valid." });
    return;
  }

  if (error instanceof Error && error.message === "ORIGIN_TIDAK_DIIZINKAN") {
    res.status(403).json({ error: "Origin tidak diizinkan." });
    return;
  }

  console.error("[api] unhandled error", error);
  res.status(500).json({
    error: "Terjadi kesalahan pada server.",
    ...(isProduction
      ? {}
      : { detail: error instanceof Error ? error.message : String(error) }),
  });
}
