"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import AuthButtons from "./AuthButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Opportunities",
    subLinks: [
      { name: "Scholarships", href: "/scholarships" },
      { name: "Internships", href: "/internships" },
      { name: "Fellowships", href: "/fellowships" },
      { name: "Competitions", href: "/competitions" },
      { name: "Conferences", href: "/conferences" },
      { name: "Workshops", href: "/workshops" },
      { name: "Exchanges", href: "/exchange_programs" },
      { name: "Jobs", href: "/jobs" },
      { name: "Online_Courses", href: "/online_courses" },
    ],
  },
  { name: "Blogs", href: "/blogs" },
  { name: "Visa Guide", href: "/visa-guides" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );

  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  const handleMobileDropdownToggle = (name: string) => {
    setOpenMobileDropdown((prev) => (prev === name ? null : name));
  };

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
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm"
      role="banner"
    >
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo - Updated to use logo.jpg */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none rounded"
          onClick={closeMobileMenu}
          aria-label="ScholarsPoint — home"
        >
          <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-lg shadow-sm border border-border/40">
            <Image
              src="/logo.jpg"
              alt="ScholarsPoint Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
            ScholarsPoint
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2" role="navigation">
          {navLinks.map((link) =>
            link.subLinks ? (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1.5 px-3 py-2 text-[15px] font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all rounded-lg"
                  >
                    <span>{link.name}</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-[220px] p-2 rounded-xl shadow-xl border-border/60"
                >
                  {link.subLinks.map((subLink) => (
                    <DropdownMenuItem
                      key={subLink.href}
                      asChild
                      className="rounded-lg py-2 cursor-pointer focus:bg-primary/5 focus:text-primary"
                    >
                      <Link
                        href={subLink.href}
                        className="w-full font-semibold"
                      >
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
                  "px-3 py-2 text-[15px] font-bold transition-all rounded-lg focus:outline-none",
                  pathname === link.href
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                )}
              >
                {link.name}
              </Link>
            ),
          )}
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-2">
          <AuthButtons />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-primary hover:bg-muted/50 transition-colors"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            className="md:hidden absolute left-0 top-20 w-full bg-background border-t border-border/40 shadow-2xl h-[calc(100vh-80px)] overflow-y-auto"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="flex flex-col p-6 space-y-3">
              {navLinks.map((link) =>
                link.subLinks ? (
                  <div key={link.name} className="w-full">
                    <button
                      onClick={() => handleMobileDropdownToggle(link.name)}
                      className="w-full flex items-center justify-between px-3 py-3.5 text-lg font-bold rounded-xl hover:bg-muted/60"
                    >
                      <span className="text-foreground">{link.name}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform duration-300",
                          openMobileDropdown === link.name && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openMobileDropdown === link.name && (
                        <motion.div
                          className="flex flex-col pl-6 mt-1 space-y-1 overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          {link.subLinks.map((subLink) => (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              onClick={closeMobileMenu}
                              className={cn(
                                "block py-3 text-[16px] rounded-lg transition-colors px-2 font-medium",
                                pathname === subLink.href
                                  ? "text-primary bg-primary/5"
                                  : "text-muted-foreground hover:bg-muted/40",
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
                      "block px-3 py-3.5 text-lg font-bold rounded-xl transition-all",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted/60",
                    )}
                  >
                    {link.name}
                  </Link>
                ),
              )}

              <div className="border-t border-border/40 pt-8 mt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-3">
                  Account
                </p>
                <div className="px-3">
                  <AuthButtons />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
