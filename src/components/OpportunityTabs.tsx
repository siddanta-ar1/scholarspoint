'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { OpportunityCard, OpportunityCardProps } from './OpportunityCard'

type AllOpportunityData = {
  [key: string]: OpportunityCardProps[]
}

const TABS_CONFIG = [
  { value: 'scholarships', label: 'Scholarships', path: '/scholarships', detailKey: 'organization', tertiaryDetailKey: 'student_level' },
  { value: 'internships', label: 'Internships', path: '/internships', detailKey: 'company', tertiaryDetailKey: 'student_level' },
  { value: 'fellowships', label: 'Fellowships', path: '/fellowships', detailKey: 'organization', tertiaryDetailKey: 'student_level' },
  { value: 'competitions', label: 'Competitions', path: '/competitions', detailKey: 'organization', tertiaryDetailKey: 'participant_level' },
  { value: 'conferences', label: 'Conferences', path: '/conferences', detailKey: 'scholarship_name', tertiaryDetailKey: 'duration' },
  { value: 'trainings', label: 'Trainings', path: '/trainings', detailKey: 'organization', tertiaryDetailKey: 'training_type' },
  { value: 'exchange_programs', label: 'Exchanges', path: '/exchange-programs', detailKey: 'organization', tertiaryDetailKey: 'duration' },
  { value: 'online_courses', label: 'Courses', path: '/online-courses', detailKey: 'institution', tertiaryDetailKey: 'pacing' },
];

export default function OpportunityTabs() {
  const [data, setData] = useState<AllOpportunityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('scholarships');

  useEffect(() => {
    const fetchAllOpportunities = async () => {
      setLoading(true)
      try {
        const queries = TABS_CONFIG.map(tab => {
          // --- FIX START ---
          // Conditionally build the select query.
          // The 'deadline' column is only selected for tables that have it.
          const selectFields = ['id', 'title', 'image_url', tab.detailKey, tab.tertiaryDetailKey];
          if (tab.value !== 'online_courses') {
            selectFields.push('deadline');
          }
          const selectQuery = selectFields.join(', ');
          // --- FIX END ---
          
          let query = supabase.from(tab.value).select(selectQuery);

          // Apply ordering based on the table type
          if (tab.value !== 'online_courses') {
            query = query.order('deadline', { ascending: true, nullsFirst: false });
          } else {
            query = query.order('created_at', { ascending: false });
          }

          return query.limit(4);
        });

        const responses = await Promise.all(queries);

        const allData = TABS_CONFIG.reduce((acc, tab, index) => {
          const response = responses[index];
          if(response.error) {
             console.error(`Error fetching ${tab.value}:`, response.error.message);
             acc[tab.value] = []; // Ensure there's an empty array on error
             return acc;
          }

          acc[tab.value] = response.data?.map((item: any) => ({
            ...item,
            detail: item[tab.detailKey],
            tertiaryDetail: item[tab.tertiaryDetailKey],
            href: `${tab.path}/${item.id}`,
          })) || [];
          return acc;
        }, {} as AllOpportunityData);

        setData(allData);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllOpportunities()
  }, [])

  const renderTabContent = (opportunities: OpportunityCardProps[], tabConfig: typeof TABS_CONFIG[0]) => {
    if (loading) {
      return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }
    if (!opportunities || opportunities.length === 0) {
      return <p className="text-center text-muted-foreground py-20">No upcoming {tabConfig.label.toLowerCase()} found.</p>;
    }
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {opportunities.map(op => <OpportunityCard key={op.id} {...op} />)}
        </div>
        <div className="text-center pt-4">
          <Button asChild variant="outline">
            <Link href={tabConfig.path}>View all {tabConfig.label.toLowerCase()} →</Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Latest Opportunities</h2>
        <p className="text-muted-foreground mt-2">Find the perfect opportunity across all our categories.</p>
      </div>

      <div className="sm:hidden mb-4">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {TABS_CONFIG.map(tab => (
              <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden sm:block">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {TABS_CONFIG.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {TABS_CONFIG.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="pt-6">
            {renderTabContent(data?.[tab.value] || [], tab)}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="sm:hidden pt-6">
        {data && renderTabContent(data[activeTab] || [], TABS_CONFIG.find(t => t.value === activeTab)!)}
      </div>
    </section>
  );
}