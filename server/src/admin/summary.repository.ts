import { pool } from "../db/pool.js";

export type AdminDashboardSummary = {
  seekerCount: number;
  companyCount: number;
  inquiryCount: number;
  /** Kebutuhan yang sudah disetujui dan lowongannya masih tayang. */
  openInquiryCount: number;
  /** Kebutuhan yang menunggu tinjauan admin — antrean kerja utama dashboard. */
  pendingInquiryCount: number;
  publishedJobCount: number;
};

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const [seekers, companies, inquiries, openInquiries, pendingInquiries, publishedJobs] =
    await Promise.all([
      pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM job_seeker_profiles`,
      ),
      pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM company_profiles`,
      ),
      pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM company_inquiries`,
      ),
      pool.query<{ count: string }>(
        `
        SELECT COUNT(*)::text AS count
        FROM company_inquiries
        WHERE status = 'disetujui'
        `,
      ),
      pool.query<{ count: string }>(
        `
        SELECT COUNT(*)::text AS count
        FROM company_inquiries
        WHERE status = 'menunggu'
        `,
      ),
      pool.query<{ count: string }>(
        `
        SELECT COUNT(*)::text AS count
        FROM jobs
        WHERE status = 'disetujui' AND is_active = TRUE
        `,
      ),
    ]);

  return {
    seekerCount: Number(seekers.rows[0]?.count ?? 0),
    companyCount: Number(companies.rows[0]?.count ?? 0),
    inquiryCount: Number(inquiries.rows[0]?.count ?? 0),
    openInquiryCount: Number(openInquiries.rows[0]?.count ?? 0),
    pendingInquiryCount: Number(pendingInquiries.rows[0]?.count ?? 0),
    publishedJobCount: Number(publishedJobs.rows[0]?.count ?? 0),
  };
}
