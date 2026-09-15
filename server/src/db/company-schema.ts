/**
 * Skema TypeScript untuk tabel `company_profiles`
 * (dibuat di 001_create_users_and_company_profiles.sql).
 */
export type CompanyProfileRow = {
  id: string;
  user_id: string;
  company_name: string;
  address: string;
  industry: string;
  nib: string;
  contact_person_name: string;
  contact_person_position: string;
  contact_person_phone: string;
  contact_person_email: string;
  created_at: Date;
  updated_at: Date;
};

/** Payload API profil perusahaan (camelCase, selaras frontend). */
export type CompanyProfile = {
  id: string;
  name: string;
  address: string;
  industry: string;
  nib: string;
  contactPerson: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
  updatedAt: string;
};

export function mapCompanyProfileRow(row: CompanyProfileRow): CompanyProfile {
  return {
    id: row.id,
    name: row.company_name,
    address: row.address,
    industry: row.industry,
    nib: row.nib,
    contactPerson: {
      name: row.contact_person_name,
      position: row.contact_person_position,
      phone: row.contact_person_phone,
      email: row.contact_person_email,
    },
    updatedAt: row.updated_at.toISOString(),
  };
}
