import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { adminAccountsRouter } from "./admin/accounts.routes.js";
import { adminCompaniesRouter } from "./admin/companies.routes.js";
import { adminInquiriesRouter } from "./admin/inquiries.routes.js";
import { adminPenyaluranRouter } from "./admin/penyaluran.routes.js";
import { adminSeekersRouter } from "./admin/seekers.routes.js";
import { adminSummaryRouter } from "./admin/summary.routes.js";
import { authRouter } from "./auth/auth.routes.js";
import { companiesRouter } from "./companies/companies.routes.js";
import { meCompanyRouter } from "./companies/me.routes.js";
import { allowedOrigins, trustProxyHops } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./http/errors.js";
import { generalLimiter } from "./http/rate-limit.js";
import { jobsRouter } from "./jobs/jobs.routes.js";
import { companyKandidatRouter } from "./placements/company.routes.js";
import { cvLayoutRouter } from "./cv/layout.routes.js";
import { meCvRouter } from "./cv/me.routes.js";
import { meRouter } from "./profiles/me.routes.js";
import { mePenyaluranRouter } from "./placements/me.routes.js";
import { meTrainingsRouter } from "./trainings/me.routes.js";
import { trainingsRouter } from "./trainings/trainings.routes.js";
import { uploadsDirectory } from "./profiles/photo-storage.js";

export const app = express();

// Rate limit hanya benar jika Express tahu berapa proxy di depannya.
app.set("trust proxy", trustProxyHops);
app.disable("x-powered-by");

app.use(
  helmet({
    // API mengirim JSON; CSP ketat dipasang di sisi Next.js.
    contentSecurityPolicy: false,
    // Berkas /uploads dibaca lintas origin oleh frontend.
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "no-referrer" },
  }),
);
app.use(compression());

app.use(
  cors({
    origin(origin, callback) {
      // Permintaan tanpa Origin (server-to-server, health check) tetap dilayani.
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
        return;
      }
      callback(new Error("ORIGIN_TIDAK_DIIZINKAN"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    maxAge: 86_400,
  }),
);

app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: false, limit: "256kb" }));
app.use(generalLimiter);

app.use(
  "/uploads",
  express.static(uploadsDirectory, {
    index: false,
    dotfiles: "deny",
    maxAge: "7d",
    setHeaders(res) {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/pelatihan", trainingsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/company/kandidat", companyKandidatRouter);
app.use("/api/cv", cvLayoutRouter);
app.use("/api/me/company", meCompanyRouter);
app.use("/api/me", meTrainingsRouter);
app.use("/api/me", meRouter);
app.use("/api/me", mePenyaluranRouter);
app.use("/api/me", meCvRouter);
app.use("/api/admin/ringkasan", adminSummaryRouter);
app.use("/api/admin/pencari-kerja", adminSeekersRouter);
app.use("/api/admin/perusahaan", adminCompaniesRouter);
app.use("/api/admin/kebutuhan", adminInquiriesRouter);
app.use("/api/admin/akun", adminAccountsRouter);
app.use("/api/admin/penyaluran", adminPenyaluranRouter);

app.use(notFoundHandler);
app.use(errorHandler);
