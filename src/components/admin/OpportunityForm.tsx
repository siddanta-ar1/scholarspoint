"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Opportunity, OpportunityType } from "@/types/database";
import {
  Loader2,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
  Building,
  MapPin,
  FileText,
  Briefcase,
  GraduationCap,
  Trophy,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "./ImageUpload";

const generateSlug = (title: string) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 7)
  );
};

const OPPORTUNITY_TYPES: { value: OpportunityType; label: string }[] = [
  { value: "scholarship", label: "Scholarship" },
  { value: "internship", label: "Internship" },
  { value: "fellowship", label: "Fellowship" },
  { value: "competition", label: "Competition" },
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "exchange_program", label: "Exchange Program" },
  { value: "job", label: "Job" },
  { value: "online_course", label: "Online Course" },
];

export default function OpportunityForm({
  initialData,
}: {
  initialData?: Opportunity;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<OpportunityType>(
    initialData?.type || "scholarship"
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    organization: initialData?.organization || "",
    country: initialData?.country || "",
    location: initialData?.location || "",
    deadline: initialData?.deadline || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    application_url: initialData?.application_url || "",
    image_url: initialData?.image_url || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    slug: initialData?.slug || "",
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
  });

  const [details, setDetails] = useState<any>(initialData?.details || {});
  const [errorState, setErrorState] = useState({ isOpen: false, message: "" });
  const [successState, setSuccessState] = useState({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setFormData({
        title: initialData.title,
        organization: initialData.organization,
        country: initialData.country || "",
        location: initialData.location || "",
        deadline: initialData.deadline || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        application_url: initialData.application_url || "",
        image_url: initialData.image_url || "",
        description: initialData.description || "",
        content: initialData.content || "",
        slug: initialData.slug || "",
        is_active: initialData.is_active ?? true,
        is_featured: initialData.is_featured ?? false,
      });
      setDetails(initialData.details || {});
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDetailChange = (name: string, value: any) => {
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        slug: initialData ? formData.slug : generateSlug(formData.title),
        type,
        details: details,
        updated_at: new Date().toISOString(),
      };

      const { error } = initialData?.id
        ? await supabase
          .from("opportunities")
          .update(payload)
          .eq("id", initialData.id)
        : await supabase.from("opportunities").insert(payload);

      if (error) throw error;
      setSuccessState({
        isOpen: true,
        message: initialData
          ? "Opportunity updated successfully."
          : "New opportunity created successfully.",
      });
    } catch (error: any) {
      setErrorState({ isOpen: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Render type-specific detail fields
  const renderTypeSpecificFields = () => {
    switch (type) {
      case "scholarship":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <GraduationCap size={14} /> Degree Level
              </Label>
              <Select
                value={details.degree || ""}
                onValueChange={(v) => handleDetailChange("degree", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelors">Bachelor's</SelectItem>
                  <SelectItem value="masters">Master's</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="postdoc">Postdoctoral</SelectItem>
                  <SelectItem value="any">Any Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <DollarSign size={14} /> Funding Type
              </Label>
              <Select
                value={details.funding_type || ""}
                onValueChange={(v) => handleDetailChange("funding_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select funding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fully_funded">Fully Funded</SelectItem>
                  <SelectItem value="partially_funded">Partially Funded</SelectItem>
                  <SelectItem value="tuition_only">Tuition Only</SelectItem>
                  <SelectItem value="self_funded">Self Funded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>GPA Requirement</Label>
              <Input
                value={details.gpa_requirement || ""}
                onChange={(e) => handleDetailChange("gpa_requirement", e.target.value)}
                placeholder="e.g., 3.5/4.0"
              />
            </div>
            <div className="grid gap-2">
              <Label>Field of Study</Label>
              <Input
                value={details.field_of_study || ""}
                onChange={(e) => handleDetailChange("field_of_study", e.target.value)}
                placeholder="e.g., Engineering, Medicine"
              />
            </div>
          </div>
        );

      case "internship":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <DollarSign size={14} /> Stipend
              </Label>
              <Input
                value={details.stipend || ""}
                onChange={(e) => handleDetailChange("stipend", e.target.value)}
                placeholder="e.g., $2000/month"
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Clock size={14} /> Duration
              </Label>
              <Input
                value={details.duration || ""}
                onChange={(e) => handleDetailChange("duration", e.target.value)}
                placeholder="e.g., 3 months"
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Briefcase size={14} /> Work Type
              </Label>
              <Select
                value={details.work_type || ""}
                onValueChange={(v) => handleDetailChange("work_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Department/Role</Label>
              <Input
                value={details.department || ""}
                onChange={(e) => handleDetailChange("department", e.target.value)}
                placeholder="e.g., Software Engineering"
              />
            </div>
          </div>
        );

      case "fellowship":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Fellowship Value</Label>
              <Input
                value={details.fellowship_value || ""}
                onChange={(e) => handleDetailChange("fellowship_value", e.target.value)}
                placeholder="e.g., $50,000"
              />
            </div>
            <div className="grid gap-2">
              <Label>Duration</Label>
              <Input
                value={details.duration || ""}
                onChange={(e) => handleDetailChange("duration", e.target.value)}
                placeholder="e.g., 1 year"
              />
            </div>
            <div className="grid gap-2">
              <Label>Focus Area</Label>
              <Input
                value={details.focus_area || ""}
                onChange={(e) => handleDetailChange("focus_area", e.target.value)}
                placeholder="e.g., Climate Research"
              />
            </div>
            <div className="grid gap-2">
              <Label>Eligibility</Label>
              <Input
                value={details.eligibility || ""}
                onChange={(e) => handleDetailChange("eligibility", e.target.value)}
                placeholder="e.g., Early-career researchers"
              />
            </div>
          </div>
        );

      case "competition":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Trophy size={14} /> Prizes
              </Label>
              <Input
                value={details.prizes?.join(", ") || ""}
                onChange={(e) =>
                  handleDetailChange(
                    "prizes",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                placeholder="e.g., $10,000, $5,000, $2,500"
              />
            </div>
            <div className="grid gap-2">
              <Label>Entry Fee</Label>
              <Input
                value={details.entry_fee || ""}
                onChange={(e) => handleDetailChange("entry_fee", e.target.value)}
                placeholder="e.g., Free, $50"
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Users size={14} /> Team Size
              </Label>
              <Input
                value={details.team_size || ""}
                onChange={(e) => handleDetailChange("team_size", e.target.value)}
                placeholder="e.g., 1-4 members"
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Input
                value={details.category || ""}
                onChange={(e) => handleDetailChange("category", e.target.value)}
                placeholder="e.g., Hackathon, Essay, Design"
              />
            </div>
          </div>
        );

      case "conference":
      case "workshop":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Registration Fee</Label>
              <Input
                value={details.registration_fee || ""}
                onChange={(e) => handleDetailChange("registration_fee", e.target.value)}
                placeholder="e.g., $100, Free"
              />
            </div>
            <div className="grid gap-2">
              <Label>Format</Label>
              <Select
                value={details.format || ""}
                onValueChange={(v) => handleDetailChange("format", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Topics</Label>
              <Input
                value={details.topics || ""}
                onChange={(e) => handleDetailChange("topics", e.target.value)}
                placeholder="e.g., AI, Machine Learning"
              />
            </div>
            <div className="grid gap-2">
              <Label>Target Audience</Label>
              <Input
                value={details.target_audience || ""}
                onChange={(e) => handleDetailChange("target_audience", e.target.value)}
                placeholder="e.g., Researchers, Students"
              />
            </div>
          </div>
        );

      case "exchange_program":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Program Duration</Label>
              <Input
                value={details.duration || ""}
                onChange={(e) => handleDetailChange("duration", e.target.value)}
                placeholder="e.g., 1 semester, 1 year"
              />
            </div>
            <div className="grid gap-2">
              <Label>Funding Coverage</Label>
              <Input
                value={details.funding_coverage || ""}
                onChange={(e) => handleDetailChange("funding_coverage", e.target.value)}
                placeholder="e.g., Full, Partial, Flight only"
              />
            </div>
            <div className="grid gap-2">
              <Label>Language Requirement</Label>
              <Input
                value={details.language_requirement || ""}
                onChange={(e) => handleDetailChange("language_requirement", e.target.value)}
                placeholder="e.g., English B2, None"
              />
            </div>
            <div className="grid gap-2">
              <Label>Age Limit</Label>
              <Input
                value={details.age_limit || ""}
                onChange={(e) => handleDetailChange("age_limit", e.target.value)}
                placeholder="e.g., 18-30 years"
              />
            </div>
          </div>
        );

      case "job":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Salary Range</Label>
              <Input
                value={details.salary || ""}
                onChange={(e) => handleDetailChange("salary", e.target.value)}
                placeholder="e.g., $50,000 - $70,000"
              />
            </div>
            <div className="grid gap-2">
              <Label>Employment Type</Label>
              <Select
                value={details.employment_type || ""}
                onValueChange={(v) => handleDetailChange("employment_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Experience Required</Label>
              <Input
                value={details.experience || ""}
                onChange={(e) => handleDetailChange("experience", e.target.value)}
                placeholder="e.g., 2-4 years"
              />
            </div>
            <div className="grid gap-2">
              <Label>Work Type</Label>
              <Select
                value={details.work_type || ""}
                onValueChange={(v) => handleDetailChange("work_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "online_course":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Cost Type</Label>
              <Select
                value={details.cost_type || ""}
                onValueChange={(v) => handleDetailChange("cost_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cost" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Pacing</Label>
              <Select
                value={details.pacing || ""}
                onValueChange={(v) => handleDetailChange("pacing", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pacing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self_paced">Self Paced</SelectItem>
                  <SelectItem value="instructor_led">Instructor Led</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Certificate?</Label>
              <Select
                value={details.certificate?.toString() || ""}
                onValueChange={(v) => handleDetailChange("certificate", v === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Certificate offered?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Subjects (Comma separated)</Label>
              <Input
                value={details.subjects?.join(", ") || ""}
                onChange={(e) =>
                  handleDetailChange(
                    "subjects",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                placeholder="e.g., Python, Data Science"
              />
            </div>
            <div className="grid gap-2">
              <Label>Duration</Label>
              <Input
                value={details.duration || ""}
                onChange={(e) => handleDetailChange("duration", e.target.value)}
                placeholder="e.g., 8 weeks, 40 hours"
              />
            </div>
            <div className="grid gap-2">
              <Label>Platform</Label>
              <Input
                value={details.platform || ""}
                onChange={(e) => handleDetailChange("platform", e.target.value)}
                placeholder="e.g., Coursera, edX"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ErrorModal
        isOpen={errorState.isOpen}
        message={errorState.message}
        onClose={() => setErrorState({ ...errorState, isOpen: false })}
      />
      <SuccessModal
        isOpen={successState.isOpen}
        message={successState.message}
        onClose={() => {
          setSuccessState({ ...successState, isOpen: false });
          router.push("/admin");
          router.refresh();
        }}
      />

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {initialData ? "Edit Opportunity" : "Create New Opportunity"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details below to {initialData ? "update" : "create"} an opportunity
            </p>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-sky-600 hover:bg-sky-700 rounded-xl h-11 px-6"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {initialData ? "Update" : "Publish"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText size={18} /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Title *</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    required
                    onChange={handleChange}
                    placeholder="e.g., Fulbright Scholarship 2025"
                    className="h-11"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <Building size={14} /> Organization *
                    </Label>
                    <Input
                      name="organization"
                      value={formData.organization}
                      required
                      onChange={handleChange}
                      placeholder="e.g., U.S. Department of State"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <MapPin size={14} /> Country
                    </Label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g., United States"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Location (City/Region)</Label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Washington D.C. or Remote"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Short Description *</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    rows={3}
                    onChange={handleChange}
                    placeholder="A brief summary of the opportunity (shown in cards)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Full Content (Markdown supported)</Label>
                  <Textarea
                    name="content"
                    value={formData.content}
                    rows={6}
                    onChange={handleChange}
                    placeholder="Detailed description, eligibility, requirements..."
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Application Link - IMPORTANT FIX */}
            <Card className="rounded-2xl shadow-sm border-sky-200 bg-sky-50/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-sky-800">
                  <LinkIcon size={18} /> Application Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label>Official Application URL *</Label>
                  <Input
                    name="application_url"
                    value={formData.application_url}
                    onChange={handleChange}
                    placeholder="https://example.com/apply"
                    className="h-11 bg-white"
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is where the "Apply Now" button will redirect users
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon size={18} /> Opportunity Poster
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                />
                <div className="mt-4">
                  <Label className="text-xs text-muted-foreground">
                    Or paste image URL directly
                  </Label>
                  <Input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="h-9 text-xs bg-gray-50 mt-1"
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Type-Specific Details */}
            <Card className="rounded-2xl shadow-sm border-blue-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {OPPORTUNITY_TYPES.find((t) => t.value === type)?.label} Details
                </CardTitle>
              </CardHeader>
              <CardContent>{renderTypeSpecificFields()}</CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Type & Status */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Opportunity Type *</Label>
                  <Select
                    value={type}
                    onValueChange={(val: OpportunityType) => {
                      setType(val);
                      setDetails({}); // Reset details when type changes
                    }}
                    disabled={!!initialData}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPPORTUNITY_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {initialData && (
                    <p className="text-xs text-muted-foreground">
                      Type cannot be changed after creation
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <div>
                    <Label className="font-medium">Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Show this opportunity publicly
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <div>
                    <Label className="font-medium">Featured</Label>
                    <p className="text-xs text-muted-foreground">
                      Highlight on homepage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar size={18} /> Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Application Deadline</Label>
                  <Input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}
