"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Loader2,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // Check if user has 'admin' role in profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/"); // Kick out non-admins
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <h2 className="font-bold text-xl text-sky-700">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Button>
          </Link>
          <Link href="/admin/opportunities/new">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
            >
              <PlusCircle size={18} /> New Opportunity
            </Button>
          </Link>
          <Link href="/admin/banners">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <FileText size={18} /> Manage Banners
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
          >
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">{children}</main>
    </div>
  );
}
