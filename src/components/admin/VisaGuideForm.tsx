"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import ImageUpload from "./ImageUpload";
import ErrorModal from "@/components/ErrorModal";
import SuccessModal from "@/components/SuccessModal";

export default function VisaGuideForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState({ isOpen: false, message: "" });
  const [successState, setSuccessState] = useState({
    isOpen: false,
    message: "",
  });

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    country: initialData?.country || "",
    visa_type: initialData?.visa_type || "Student Visa",
    description: initialData?.description || "",
    processing_time: initialData?.processing_time || "",
    fees: initialData?.fees || "",
    image_url: initialData?.image_url || "",
    author: initialData?.author || "ScholarsPoint Team",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let error;
      if (initialData?.id) {
        const res = await supabase
          .from("visa_guides")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", initialData.id);
        error = res.error;
      } else {
        const res = await supabase.from("visa_guides").insert([formData]);
        error = res.error;
      }

      if (error) throw error;
      setSuccessState({
        isOpen: true,
        message: "Visa guide synchronized successfully.",
      });
    } catch (err: any) {
      setErrorState({ isOpen: true, message: err.message });
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
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto space-y-6 pb-20"
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="text-sky-600" />{" "}
            {initialData ? "Edit Visa Guide" : "Create New Visa Guide"}
          </h1>
          <Button
            type="submit"
            disabled={loading}
            className="ml-auto bg-sky-600"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}{" "}
            Save Guide
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Guide Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Country</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Visa Type</Label>
                    <Input
                      value={formData.visa_type}
                      onChange={(e) =>
                        setFormData({ ...formData, visa_type: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Overview Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logistics & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Guide Poster</Label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={(url) =>
                      setFormData({ ...formData, image_url: url })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Processing Time</Label>
                  <Input
                    value={formData.processing_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        processing_time: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Fees</Label>
                  <Input
                    value={formData.fees}
                    onChange={(e) =>
                      setFormData({ ...formData, fees: e.target.value })
                    }
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
