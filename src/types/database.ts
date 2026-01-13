export type OpportunityType =
  | "scholarship"
  | "internship"
  | "fellowship"
  | "competition"
  | "conference"
  | "workshop"
  | "exchange_program"
  | "job"
  | "online_course";

export type UserRole = "user" | "admin" | "moderator";

// --- Type-Specific Details Interfaces ---

export interface ScholarshipDetails {
  degree?: string; // e.g., "Masters", "PhD"
  funding_type?: "fully_funded" | "partially_funded" | "self_funded";
  gpa_requirement?: string;
}

export interface InternshipDetails {
  stipend?: string;
  duration?: string;
  work_type?: "remote" | "on-site" | "hybrid";
}

export interface CompetitionDetails {
  prizes?: string[];
  entry_fee?: string;
  team_size?: string;
}

// Fallback for types that don't have specific strict fields yet
export interface GenericDetails {
  [key: string]: any;
}

// --- The Master Opportunity Interface ---
export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  type: OpportunityType;
  organization: string; // The company or university name
  country: string | null;
  location: string | null;

  // Visuals
  image_url: string | null;

  // Dates
  deadline: string | null;
  start_date?: string | null;
  end_date?: string | null;

  // Status
  is_active: boolean;
  is_featured: boolean;

  // Data
  description: string | null;
  application_url: string | null;

  // The Polymorphic Column
  details:
    | ScholarshipDetails
    | InternshipDetails
    | CompetitionDetails
    | GenericDetails;

  created_at: string;
}
