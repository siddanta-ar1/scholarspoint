"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DashboardTable from "@/components/admin/DashboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  Globe,
  PlusCircle,
  TrendingUp,
  Users,
  Eye,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type Stats = {
  opportunities: number;
  posts: number;
  visa_guides: number;
  activeOpportunities: number;
  expiredOpportunities: number;
};

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "opportunities");
  const [stats, setStats] = useState<Stats>({
    opportunities: 0,
    posts: 0,
    visa_guides: 0,
    activeOpportunities: 0,
    expiredOpportunities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const fetchStats = async () => {
      const [oppsResult, postsResult, guidesResult] = await Promise.all([
        supabase.from("opportunities").select("id, is_active, deadline", { count: "exact" }),
        supabase.from("posts").select("id", { count: "exact" }),
        supabase.from("visa_guides").select("id", { count: "exact" }),
      ]);

      const opportunities = oppsResult.data || [];
      const today = new Date().toISOString().split("T")[0];

      const activeOpps = opportunities.filter(
        (o: any) => o.is_active && (!o.deadline || o.deadline >= today)
      ).length;

      const expiredOpps = opportunities.filter(
        (o: any) => o.deadline && o.deadline < today
      ).length;

      setStats({
        opportunities: oppsResult.count || 0,
        posts: postsResult.count || 0,
        visa_guides: guidesResult.count || 0,
        activeOpportunities: activeOpps,
        expiredOpportunities: expiredOpps,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Opportunities",
      value: stats.opportunities,
      icon: GraduationCap,
      color: "bg-sky-500",
      href: "/admin?tab=opportunities",
    },
    {
      label: "Active & Open",
      value: stats.activeOpportunities,
      icon: TrendingUp,
      color: "bg-green-500",
      href: "/admin?tab=opportunities",
    },
    {
      label: "Expired",
      value: stats.expiredOpportunities,
      icon: AlertCircle,
      color: "bg-red-500",
      href: "/admin?tab=opportunities",
    },
    {
      label: "Blog Posts",
      value: stats.posts,
      icon: BookOpen,
      color: "bg-purple-500",
      href: "/admin?tab=posts",
    },
    {
      label: "Visa Guides",
      value: stats.visa_guides,
      icon: Globe,
      color: "bg-orange-500",
      href: "/admin?tab=visa_guides",
    },
  ];

  const quickActions = [
    {
      label: "New Opportunity",
      href: "/admin/opportunities/new",
      icon: GraduationCap,
      color: "bg-sky-600 hover:bg-sky-700",
    },
    {
      label: "New Blog Post",
      href: "/admin/blogs/new",
      icon: BookOpen,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      label: "New Visa Guide",
      href: "/admin/visa_guides/new",
      icon: Globe,
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-lg transition-all cursor-pointer border-none bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.color} text-white`}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900">
                  {loading ? "..." : stat.value}
                </div>
                <div className="text-xs text-gray-500 font-medium mt-1">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <p className="text-gray-400 text-sm">Create new content in one click</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button className={`${action.color} text-white rounded-xl h-11 px-5 font-bold shadow-lg`}>
                <action.icon size={16} className="mr-2" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Content Tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100/50 p-1.5 rounded-2xl h-auto flex-wrap">
          <TabsTrigger
            value="opportunities"
            className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold"
          >
            <GraduationCap size={16} className="mr-2" />
            Opportunities
            <span className="ml-2 px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">
              {stats.opportunities}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold"
          >
            <BookOpen size={16} className="mr-2" />
            Blog Posts
            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
              {stats.posts}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="visa_guides"
            className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold"
          >
            <Globe size={16} className="mr-2" />
            Visa Guides
            <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
              {stats.visa_guides}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <DashboardTable resource="opportunities" />
        </TabsContent>
        <TabsContent value="posts">
          <DashboardTable resource="posts" />
        </TabsContent>
        <TabsContent value="visa_guides">
          <DashboardTable resource="visa_guides" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
