import { pool } from "../db/pool.js";

export type AdminDashboardSummary = {
  seekerCount: number;
  companyCount: number;
  inquiryCount: number;
  openInquiryCount: number;
};

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const [seekers, companies, inquiries, openInquiries] = await Promise.all([
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
      WHERE status = 'terbuka'
      `,
    ),
  ]);

  return {
    seekerCount: Number(seekers.rows[0]?.count ?? 0),
    companyCount: Number(companies.rows[0]?.count ?? 0),
    inquiryCount: Number(inquiries.rows[0]?.count ?? 0),
    openInquiryCount: Number(openInquiries.rows[0]?.count ?? 0),
  };
}
