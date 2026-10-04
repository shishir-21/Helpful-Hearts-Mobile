export type DoctorCredential = {
  id: string;
  degree: string;
  institution: string | null;
  year_awarded: number | null;
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  verified_at: string | null;
  source_name: string;
  source_url: string | null;
};

export type Doctor = {
  id: string;
  full_name: string;
  specialty: string;
  hospital_name: string | null;
  biography: string | null;
  years_experience: number | null;
  languages: string | null;
  public_phone: string | null;
  public_email: string | null;
  booking_instructions: string | null;
  profile_status: "draft" | "submitted" | "verified" | "rejected";
  is_demo: boolean;
  source_name: string;
  source_url: string | null;
  updated_at: string;
  credentials: DoctorCredential[];
};

export type DoctorSearchResponse = {
  items: Doctor[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

export type AvailabilitySlot = {
  starts_at: string;
  ends_at: string;
  timezone: string;
};
