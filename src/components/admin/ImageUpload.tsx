"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ErrorModal from "@/components/ErrorModal";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setErrorMsg(null);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("public-images") // Ensure this matches your bucket name
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get Public URL
      const { data } = supabase.storage
        .from("public-images")
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
    } catch (error: any) {
      if (error.message?.includes("violates row-level security")) {
        setErrorMsg(
          "Access Denied: You don't have permission to upload files. Please ensure you are logged in as an administrator.",
        );
      } else {
        setErrorMsg(error.message || "An error occurred during upload.");
      }
    } finally {
      setUploading(false);
    }
  };

  if (value) {
    return (
      <div className="relative w-full h-48 rounded-md overflow-hidden bg-gray-100 border">
        <div className="absolute top-2 right-2 z-10">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Image src={value} alt="Upload" fill className="object-cover" />
      </div>
    );
  }

  return (
    <>
      <ErrorModal
        isOpen={!!errorMsg}
        title="Upload Failed"
        message={errorMsg || ""}
        onClose={() => setErrorMsg(null)}
      />
      <div className="w-full h-48 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <>
            <UploadCloud className="h-10 w-10 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                Click to upload poster
              </p>
              <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
            </div>
            <input
              type="file"
              disabled={disabled}
              onChange={onUpload}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </>
        )}
      </div>
    </>
  );
}
