"use client";

import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import {
  FacebookIcon,
  Instagram,
  Youtube,
  MessageCircleMore as Discord,
  Music2 as Tiktok,
} from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t mt-3 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ScholarsPoint Brand with Logo */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-lg">
                <Image
                  src="/logo.jpg"
                  alt="ScholarsPoint Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-blue-600">
                ScholarsPoint
              </h2>
            </Link>
            <p className="text-sm">
              Explore scholarships, internships, fellowships, and visa guidance
              tailored for students around the world.
            </p>
          </div>

          {/* Useful Links */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Follow Us
            </h3>
            <div className="flex items-center gap-4 mt-3">
              <Link
                href="https://www.facebook.com/scholars.point.133274"
                target="_blank"
                className="hover:text-blue-600 transition-colors"
              >
                <FacebookIcon size={22} />
              </Link>
              <Link
                href="https://www.instagram.com/scholarspoint3/"
                target="_blank"
                className="hover:text-pink-500 transition-colors"
              >
                <Instagram size={22} />
              </Link>
              <Link
                href="https://www.youtube.com/@siddantasodari5147/videos"
                target="_blank"
                className="hover:text-red-600 transition-colors"
              >
                <Youtube size={22} />
              </Link>
              <Link
                href="https://www.tiktok.com/@scholars_point"
                target="_blank"
                className="hover:text-black transition-colors"
              >
                <Tiktok size={22} />
              </Link>
              <Link
                href="https://discord.com/channels/1349749753965183087/1349749754648858636"
                target="_blank"
                className="hover:text-indigo-500 transition-colors"
              >
                <Discord size={22} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t pt-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {year}{" "}
            <span className="font-semibold text-blue-600">ScholarsPoint</span>.
            All rights reserved.
          </p>
          <p className="text-xs mt-2 md:mt-0 italic">
            "You are only the reason for your success."
          </p>
        </div>
      </div>
    </footer>
  );
}
