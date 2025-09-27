'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import AuthButtons from './AuthButton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Blogs', href: '/blogs' },
  {
    name: 'Opportunities',
    subLinks: [
      { name: 'Scholarships', href: '/scholarships' },
      { name: 'Internships', href: '/internships' },
      { name: 'Fellowships', href: '/fellowships' },
      { name: 'Competitions', href: '/competitions' },
      { name: 'Exchange Programs', href: '/exchange-programs' },
    ],
  },
  {
    name: 'Learning',
    subLinks: [
      { name: 'Online Courses', href: '/online-courses' },
      { name: 'Trainings', href: '/trainings' },
      { name: 'Conferences', href: '/conferences' },
    ],
  },
  { name: 'Visa Guide', href: '/visa-guides' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  )

  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setOpenMobileDropdown(null)
  }

  const handleMobileDropdownToggle = (name: string) => {
    setOpenMobileDropdown((prev) => (prev === name ? null : name))
  }

  const mobileMenuVariants: Variants = {
    hidden: { opacity: 0, y: -12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
    },
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm"
      role="banner"
    >
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-primary hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
          onClick={closeMobileMenu}
          aria-label="ScholarsPoint — home"
        >
          <span className="text-[22px]">🎓</span>
          {/* UPDATED LINE: Removed 'hidden' and 'sm:inline' to make it always visible */}
          <span>ScholarsPoint</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-4"
          role="navigation"
          aria-label="Main"
        >
          {navLinks.map((link) =>
            link.subLinks ? (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                    aria-haspopup="menu"
                    aria-expanded={false}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[200px]">
                  {link.subLinks.map((subLink) => (
                    <DropdownMenuItem key={subLink.href} asChild>
                      <Link href={subLink.href} className="w-full">
                        {subLink.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-semibold transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-primary',
                )}
              >
                {link.name}
              </Link>
            ),
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <AuthButtons />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded p-2 text-primary hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            className="md:hidden absolute left-0 top-20 w-full bg-background border-t border-border/40 shadow-lg"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="region"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) =>
                link.subLinks ? (
                  <div key={link.name} className="w-full">
                    <button
                      onClick={() => handleMobileDropdownToggle(link.name)}
                      className="w-full flex items-center justify-between px-2 py-3 text-base font-semibold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:bg-muted/60"
                      aria-expanded={openMobileDropdown === link.name}
                      aria-controls={`mobile-sub-${link.name}`}
                    >
                      <span className="text-foreground">{link.name}</span>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 transition-transform',
                          openMobileDropdown === link.name && 'rotate-180',
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openMobileDropdown === link.name && (
                        <motion.div
                          id={`mobile-sub-${link.name}`}
                          className="flex flex-col pl-4 mt-1 space-y-1 overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        >
                          {link.subLinks.map((subLink) => (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              onClick={closeMobileMenu}
                              className={cn(
                                'block py-2 rounded-md transition hover:bg-muted',
                                pathname === subLink.href
                                  ? 'text-primary font-semibold'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'block p-2 text-base font-semibold rounded-md transition hover:bg-muted',
                      pathname === link.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground',
                    )}
                  >
                    {link.name}
                  </Link>
                ),
              )}

              <div className="border-t border-border/40 pt-4 mt-4">
                <AuthButtons />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar