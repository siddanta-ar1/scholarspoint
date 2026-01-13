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
  Zap,
  Award,
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

export default function OpportunityForm({
  initialData,
}: {
  initialData?: Opportunity;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<OpportunityType>(
    initialData?.type || "scholarship",
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    organization: initialData?.organization || "",
    country: initialData?.country || "",
    deadline: initialData?.deadline || "",
    application_url: initialData?.application_url || "",
    image_url: initialData?.image_url || "",
    description: initialData?.description || "",
    slug: initialData?.slug || "",
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
        deadline: initialData.deadline || "",
        application_url: initialData.application_url || "",
        image_url: initialData.image_url || "",
        description: initialData.description || "",
        slug: initialData.slug || "",
      });
      setDetails(initialData.details || {});
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. LIMIT CHECK: System Limit of 5 live opportunities
      if (!initialData) {
        const { count, error: countError } = await supabase
          .from("opportunities")
          .select("*", { count: "exact", head: true });
        if (countError) throw countError;
        if (count !== null && count >= 5)
          throw new Error(
            "System Limit: You have reached the maximum of 5 live opportunities.",
          );
      }

      const payload = {
        ...formData,
        slug: initialData ? formData.slug : generateSlug(formData.title),
        type,
        is_active: true,
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
          ? "Synchronized successfully."
          : "New opportunity is now live.",
      });
    } catch (error: any) {
      setErrorState({ isOpen: true, message: error.message });
    } finally {
      setLoading(false);
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

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto space-y-6 pb-20"
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {initialData ? "Edit Opportunity" : "New Opportunity"}
          </h1>
          <Button
            type="submit"
            disabled={loading}
            className="ml-auto gap-2 bg-sky-600 hover:bg-sky-700"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}{" "}
            Save
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Organization</Label>
                    <Input
                      name="organization"
                      value={formData.organization}
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Country</Label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    rows={3}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-sky-200 bg-sky-50/30">
              <CardHeader>
                <CardTitle className="text-sky-800 flex items-center gap-2">
                  <ImageIcon size={18} /> Opportunity Poster
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) =>
                    setFormData({ ...formData, image_url: url })
                  }
                />
                <div className="mt-4">
                  <Label className="text-[10px] text-muted-foreground uppercase">
                    Manual URL Overlay
                  </Label>
                  <Input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* DYNAMIC DETAILS SECTION */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Type-Specific Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {type === "online_course" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Cost Type</Label>
                      <Select
                        value={details.cost_type}
                        onValueChange={(v) =>
                          setDetails({ ...details, cost_type: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Cost" />
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
                        value={details.pacing}
                        onValueChange={(v) =>
                          setDetails({ ...details, pacing: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Pacing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self_paced">Self Paced</SelectItem>
                          <SelectItem value="instructor_led">
                            Instructor Led
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Certificate?</Label>
                      <Select
                        value={details.certificate?.toString()}
                        onValueChange={(v) =>
                          setDetails({ ...details, certificate: v === "true" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                          setDetails({
                            ...details,
                            subjects: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                {/* Scholarship/Internship specific fields go here similarly */}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={type}
                    onValueChange={(val: any) => {
                      setType(val);
                      setDetails({});
                    }}
                    disabled={!!initialData}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="fellowship">Fellowship</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="exchange_program">
                        Exchange Program
                      </SelectItem>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="online_course">
                        Online Course
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
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
