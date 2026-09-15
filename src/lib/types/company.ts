export type CompanyContactPerson = {
  name: string;
  position: string;
  phone: string;
  email: string;
};

export type CompanyProfile = {
  id: string;
  name: string;
  address: string;
  industry: string;
  nib: string;
  contactPerson: CompanyContactPerson;
  updatedAt: string;
};

/** Ringkasan perusahaan untuk daftar admin. */
export type AdminCompanySummary = {
  id: string;
  name: string;
  industry: string;
  city: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  openInquiryCount: number;
};
