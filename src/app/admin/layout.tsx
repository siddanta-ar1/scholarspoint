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
  ChevronDown,
  GraduationCap,
  BookOpen,
  Globe,
  Image as ImageIcon,
  List,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Opportunities",
    icon: GraduationCap,
    children: [
      { name: "All Opportunities", href: "/admin" },
      { name: "New Opportunity", href: "/admin/opportunities/new" },
    ],
  },
  {
    name: "Blogs",
    icon: BookOpen,
    children: [
      { name: "All Posts", href: "/admin?tab=posts" },
      { name: "New Post", href: "/admin/blogs/new" },
    ],
  },
  {
    name: "Visa Guides",
    icon: Globe,
    children: [
      { name: "All Guides", href: "/admin?tab=visa_guides" },
      { name: "New Guide", href: "/admin/visa_guides/new" },
    ],
  },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Opportunities"]);

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

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-sky-600" size={40} />
          <p className="text-sm text-gray-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );

  if (!authorized) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      {/* Fixed Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col z-50 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b bg-gradient-to-r from-sky-600 to-blue-600">
          <Link href="/admin">
            <h2 className="font-black text-2xl tracking-tighter text-white">
              SCHOLARS<span className="text-sky-200">POINT</span>
            </h2>
            <p className="text-xs text-sky-100 font-medium mt-1">Admin Panel</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.name}>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between h-11 rounded-xl px-4 font-semibold transition-all text-left",
                    expandedMenus.includes(item.name)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.name}
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform",
                      expandedMenus.includes(item.name) && "rotate-180"
                    )}
                  />
                </button>
                {expandedMenus.includes(item.name) && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-9 text-sm font-medium rounded-lg",
                            isActive(child.href)
                              ? "bg-sky-50 text-sky-700"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          {child.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href!}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between h-11 rounded-xl px-4 font-semibold transition-all",
                    isActive(item.href!)
                      ? "bg-sky-50 text-sky-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.name}
                  </div>
                  {isActive(item.href!) && <ChevronRight size={16} />}
                </Button>
              </Link>
            )
          )}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t space-y-2">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              className="w-full h-10 rounded-xl text-gray-600 border-gray-200"
            >
              <Globe size={16} className="mr-2" /> View Site
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full h-10 rounded-xl text-red-600 border-red-100 hover:bg-red-50"
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
          >
            <LogOut size={16} className="mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {pathname === "/admin"
                  ? "Dashboard"
                  : pathname.includes("opportunities")
                    ? "Opportunities"
                    : pathname.includes("blogs")
                      ? "Blog Posts"
                      : pathname.includes("visa")
                        ? "Visa Guides"
                        : pathname.includes("banners")
                          ? "Home Banners"
                          : "Admin"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/opportunities/new">
                <Button className="bg-sky-600 hover:bg-sky-700 rounded-xl h-9 px-4 text-sm font-bold">
                  <PlusCircle size={16} className="mr-2" /> New Opportunity
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12 pb-32">{children}</div>
      </main>
    </div>
  );
}
