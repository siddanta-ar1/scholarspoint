"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/lib/AuthContext";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <AuthProvider>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </AuthProvider>
  );
}
