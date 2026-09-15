import cors from "cors";
import express from "express";
import { adminAccountsRouter } from "./admin/accounts.routes.js";
import { adminCompaniesRouter } from "./admin/companies.routes.js";
import { adminPenyaluranRouter } from "./admin/penyaluran.routes.js";
import { adminSeekersRouter } from "./admin/seekers.routes.js";
import { adminSummaryRouter } from "./admin/summary.routes.js";
import { authRouter } from "./auth/auth.routes.js";
import { companiesRouter } from "./companies/companies.routes.js";
import { meCompanyRouter } from "./companies/me.routes.js";
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

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));

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
app.use("/api/admin/akun", adminAccountsRouter);
app.use("/api/admin/penyaluran", adminPenyaluranRouter);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  },
);
