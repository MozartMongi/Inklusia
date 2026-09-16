import rateLimit, { type Options } from "express-rate-limit";

function limiter(options: Partial<Options> & Pick<Options, "windowMs" | "limit">) {
  return rateLimit({
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      error: "Terlalu banyak permintaan. Coba lagi dalam beberapa menit.",
    },
    ...options,
  });
}

/** Batas umum untuk seluruh API agar satu klien tidak membanjiri server. */
export const generalLimiter = limiter({
  windowMs: 60_000,
  limit: 300,
});

/**
 * Login, registrasi, dan reset kata sandi dibatasi ketat karena
 * jadi sasaran brute force dan pembuatan akun massal.
 */
export const authLimiter = limiter({
  windowMs: 15 * 60_000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: {
    error:
      "Terlalu banyak percobaan. Silakan tunggu 15 menit sebelum mencoba lagi.",
  },
});

/** Pendaftaran akun baru: lebih longgar dari login, tetap dibatasi per IP. */
export const registerLimiter = limiter({
  windowMs: 60 * 60_000,
  limit: 20,
  message: {
    error: "Terlalu banyak pendaftaran dari jaringan ini. Coba lagi nanti.",
  },
});

/** Unggah berkas mahal di sisi I/O, jadi dibatasi terpisah. */
export const uploadLimiter = limiter({
  windowMs: 60_000,
  limit: 20,
  message: {
    error: "Terlalu banyak unggahan. Coba lagi dalam satu menit.",
  },
});
