// components/OpportunityList.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'

type Opportunity = {
  id: string
  title: string
  student_level: string
  image_url?: string
  organization?: string
  company?: string
}

type Props = {
  title: string
  data: Opportunity[]
  type: string
  labelKey: 'organization' | 'company'
}

export default function OpportunityList({ title, data, type, labelKey }: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {title} <BadgeCheck className="text-blue-500" size={20} />
      </h3>
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.id} className="border rounded-xl bg-white hover:shadow-lg transition">
            <Link href={`/${type}/${item.id}`} className="flex gap-4">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="w-24 h-24 object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No Image
                </div>
              )}
              <div className="py-2 pr-3">
                <h4 className="font-semibold text-blue-700 line-clamp-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item[labelKey]}</p>
                <p className="text-xs capitalize text-gray-500 mt-1">{item.student_level}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={`/${type}`} className="mt-4 inline-block text-sm text-blue-600 font-medium hover:underline">
        View all {title.toLowerCase()} →
      </Link>
    </div>
  )
}
