'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import AuthButtons from './AuthButton'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Internships', href: '/internships' },
  { name: 'Fellowships', href: '/fellowships' },
  { name: 'Visa Guide', href: '/visa-guides' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-blue-700 hover:text-blue-800 transition-colors"
            onClick={closeMenu}
          >
            🎓 ScholarsPoint
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-semibold px-3 py-1 rounded transition duration-200',
                  pathname === link.href
                    ? 'text-blue-700 underline underline-offset-4'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            <AuthButtons />
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-blue-700 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-blue-200 animate-slideDown">
          <nav className="flex flex-col px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  'block text-sm font-medium px-3 py-2 rounded-md transition hover:bg-blue-100',
                  pathname === link.href ? 'text-blue-700 underline' : 'text-gray-800'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-3 px-3">
              <AuthButtons />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
