'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession()
      if (!error) {
        router.push('/dashboard') // or homepage
      } else {
        console.error(error)
        router.push('/login')
      }
    }

    handleAuth()
  }, [router])

  return <p className="text-center py-10">Signing in...</p>
}
