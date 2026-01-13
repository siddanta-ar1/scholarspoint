"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Loader2,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  FileText,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (profile?.role !== "admin") {
        router.push("/");
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-sky-600" size={40} />
      </div>
    );
  if (!authorized) return null;

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "New Opportunity",
      href: "/admin/opportunities/new",
      icon: PlusCircle,
    },
    { name: "Banners", href: "/admin/banners", icon: FileText },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      {/* Fixed Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col z-50">
        <div className="p-8 border-b">
          <h2 className="font-black text-2xl tracking-tighter">
            ADMIN <span className="text-sky-600">HUB</span>
          </h2>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between h-12 rounded-xl px-4 font-bold transition-all",
                  pathname === item.href
                    ? "bg-sky-50 text-sky-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  {item.name}
                </div>
                {pathname === item.href && <ChevronRight size={16} />}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl text-red-600 border-red-100 hover:bg-red-50"
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
          >
            <LogOut size={18} className="mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto relative p-8 lg:p-12 pb-32">
        {children}
      </main>
    </div>
  );
}
