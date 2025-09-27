'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Tag } from 'lucide-react'

export type OpportunityCardProps = {
  id: string
  title: string
  image_url?: string | null
  detail?: string // Organization, company, etc.
  href: string
  tertiaryDetail?: string | null // Replaces student_level for more flexibility
  deadline?: string | null
}

// Updated DeadlineBadge to always show relative time for future dates
const DeadlineBadge = ({ deadline }: { deadline: string | null | undefined }) => {
  if (!deadline) return null;

  const today = new Date();
  const deadlineDate = new Date(deadline);
  today.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return <Badge variant="destructive" className="bg-red-700">Expired</Badge>;
  }
  if (daysLeft <= 7) {
    return <Badge variant="destructive">Ends in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}</Badge>;
  }
  if (daysLeft <= 30) {
    return <Badge variant="secondary" className="bg-orange-500 text-white">Ends in {daysLeft} days</Badge>;
  }
  // This is the change: always show days left for deadlines further out
  return <Badge variant="outline" className= "bg-green-600 text-white">Ends in {daysLeft} days</Badge>;
};

export const OpportunityCard = ({ title, image_url, detail, href, tertiaryDetail, deadline }: OpportunityCardProps) => {
  return (
    <Link href={href} className="no-underline h-full group outline-none">
      <Card 
        className={cn(
          "h-full overflow-hidden bg-background border-border/60 shadow-sm",
          "transition-all duration-300 ease-in-out", 
          "hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary"
        )}
      >
        <div className="flex gap-4 p-3">
          <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={image_url || '/placeholder-image.jpg'}
              alt={title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          
          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="font-bold text-card-foreground line-clamp-2 leading-tight">
              {title}
            </h4>
            {detail && <p className="text-sm text-muted-foreground truncate">{detail}</p>}
            
            <div className="flex-grow" /> 
            
            <div className="flex items-center justify-between mt-2 flex-wrap gap-x-2">
              {tertiaryDetail && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
                  <Tag className="w-3 h-3"/>
                  <span>{tertiaryDetail.replace(/_/g, ' ')}</span>
                </div>
              )}
              <div className="ml-auto">
                 <DeadlineBadge deadline={deadline} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}