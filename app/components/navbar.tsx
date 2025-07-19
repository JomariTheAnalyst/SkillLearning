"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useSession } from "next-auth/react";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block">SkillLearn</span>
          </Link>
          {session && (
            <Link
              href="/dashboard/courses"
              className="flex items-center text-lg font-medium transition-colors hover:text-primary"
            >
              Courses
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!session ? (
          <Link
            href="/auth/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Login
          </Link>
          ) : (
            <Link
              href="/dashboard"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 