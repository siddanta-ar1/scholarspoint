"use client";

import { useAuth } from "@/lib/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function AuthButtons() {
  const { user, isLoading, isAdmin, signInWithGoogle, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
      </div>
    );
  }

  // Robust Avatar detection
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary transition-all overflow-hidden focus:outline-none ring-2 ring-transparent hover:ring-primary/10">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-sky-100 text-sky-700">
                  <User size={20} />
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 mt-2 p-2 rounded-2xl shadow-2xl border-border/50 backdrop-blur-md bg-white/95"
          >
            <DropdownMenuLabel className="p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-foreground">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem
                asChild
                className="rounded-lg py-2.5 cursor-pointer focus:bg-sky-50 focus:text-sky-700"
              >
                <Link href="/admin" className="flex items-center w-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="rounded-lg py-2.5 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={handleLogin}
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-6 shadow-lg shadow-sky-200 transition-all hover:scale-105 active:scale-95 font-bold"
        >
          Join ScholarsPoint
        </Button>
      )}
    </div>
  );
}
