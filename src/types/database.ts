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
  degree?: string;
  funding_type?: "fully_funded" | "partially_funded" | "tuition_only" | "self_funded";
  gpa_requirement?: string;
  field_of_study?: string;
}

export interface InternshipDetails {
  stipend?: string;
  duration?: string;
  work_type?: "remote" | "on-site" | "hybrid";
  department?: string;
}

export interface FellowshipDetails {
  fellowship_value?: string;
  duration?: string;
  focus_area?: string;
  eligibility?: string;
}

export interface CompetitionDetails {
  prizes?: string[];
  entry_fee?: string;
  team_size?: string;
  category?: string;
}

export interface ConferenceWorkshopDetails {
  registration_fee?: string;
  format?: "in-person" | "virtual" | "hybrid";
  topics?: string;
  target_audience?: string;
}

export interface ExchangeProgramDetails {
  duration?: string;
  funding_coverage?: string;
  language_requirement?: string;
  age_limit?: string;
}

export interface JobDetails {
  salary?: string;
  employment_type?: "full-time" | "part-time" | "contract";
  experience?: string;
  work_type?: "remote" | "on-site" | "hybrid";
}

export interface OnlineCourseDetails {
  cost_type?: "free" | "paid" | "freemium";
  pacing?: "self_paced" | "instructor_led";
  certificate?: boolean;
  subjects?: string[];
  duration?: string;
  platform?: string;
}

// Fallback for types that don't have specific strict fields yet
export interface GenericDetails {
  [key: string]: any;
}

// Union of all detail types
export type OpportunityDetails =
  | ScholarshipDetails
  | InternshipDetails
  | FellowshipDetails
  | CompetitionDetails
  | ConferenceWorkshopDetails
  | ExchangeProgramDetails
  | JobDetails
  | OnlineCourseDetails
  | GenericDetails;

// --- The Master Opportunity Interface ---
export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  type: OpportunityType;
  organization: string;
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
  views_count?: number;

  // Content
  description: string | null;
  content?: string | null;
  application_url: string | null;

  // The Polymorphic Column
  details: OpportunityDetails;

  // Timestamps
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

// --- Post Interface ---
export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  author_name: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// --- Visa Guide Interface ---
export interface VisaGuide {
  id: string;
  title: string;
  country: string;
  visa_type: string | null;
  description: string | null;
  processing_time: string | null;
  fees: string | null;
  image_url: string | null;
  requirements: any;
  process_steps: any;
  useful_links: any;
  content: any;
  author: string | null;
  published_date: string | null;
  created_at: string;
  updated_at: string;
}

// --- Banner Interface ---
export interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  display_order: number;
  description: string | null;
  background_color: string;
  text_color: string;
  btn_text: string;
  created_at: string;
}

// --- Profile Interface ---
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}
