"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  BookOpen,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Flag,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardTable from "@/components/admin/DashboardTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "opportunities" | "posts" | "visa_guides"
  >("opportunities");

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-sky-600" size={36} /> Admin{" "}
            <span className="text-sky-600">Hub</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-1 font-medium italic">
            Empower global students with verified information.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/banners`}>
            <Button
              variant="outline"
              className="h-12 px-6 gap-2 rounded-xl font-bold border-sky-200 text-sky-700 hover:bg-sky-50"
            >
              <Flag size={18} /> Edit Home Banners
            </Button>
          </Link>
          <Link
            href={`/admin/${activeTab === "posts" ? "blogs" : activeTab}/new`}
          >
            <Button className="h-12 px-6 gap-2 bg-sky-600 hover:bg-sky-700 shadow-xl rounded-xl font-bold transition-all hover:-translate-y-0.5">
              <Plus size={20} /> Create New
            </Button>
          </Link>
        </div>
      </div>

      <Tabs
        defaultValue="opportunities"
        onValueChange={(val: any) => setActiveTab(val)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] h-14 bg-gray-100 dark:bg-neutral-800 p-1.5 rounded-[20px] mb-8 shadow-inner">
          <TabsTrigger
            value="opportunities"
            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-md gap-2 font-bold transition-all"
          >
            <GraduationCap size={18} /> Opportunities
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-md gap-2 font-bold transition-all"
          >
            <BookOpen size={18} /> Blogs
          </TabsTrigger>
          <TabsTrigger
            value="visa_guides"
            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-md gap-2 font-bold transition-all"
          >
            <Globe size={18} /> Visa Guides
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="opportunities">
            <DashboardTable resource="opportunities" />
          </TabsContent>
          <TabsContent value="posts">
            <DashboardTable resource="posts" />
          </TabsContent>
          <TabsContent value="visa_guides">
            <DashboardTable resource="visa_guides" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
