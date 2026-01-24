"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import VisaGuideForm from "@/components/admin/VisaGuideForm";
import { Loader2 } from "lucide-react";

export default function EditVisaGuidePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [guide, setGuide] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            const { data, error } = await supabase
                .from("visa_guides")
                .select("*")
                .eq("id", id)
                .single();

            if (!error && data) {
                setGuide(data);
            }
            setLoading(false);
        };
        fetchGuide();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-sky-600" size={32} />
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-900">Visa Guide Not Found</h2>
                <p className="text-gray-500 mt-2">The requested guide does not exist.</p>
            </div>
        );
    }

    return <VisaGuideForm initialData={guide} />;
}
