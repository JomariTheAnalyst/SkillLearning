"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle, Clock } from "lucide-react";

export default function ExcelCoursePage() {
  const { data: session } = useSession();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  async function handleEnroll() {
    if (!session) {
      window.location.href = "/auth/login?callbackUrl=/courses/excel";
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch("/api/enrollments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: "excel-basics",
          category: "excel",
        }),
      });

      if (response.ok) {
        setIsEnrolled(true);
      } else {
        console.error("Failed to enroll");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    } finally {
      setIsEnrolling(false);
    }
  }

  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-3">
        <div className="flex flex-col justify-between space-y-4 xl:col-span-2">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Excel Basics</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Learn essential Excel skills for data organization, analysis, and visualization.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              href="/courses/excel/excel-basics"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              View Course
            </Link>
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {isEnrolling ? "Enrolling..." : "Enroll Now"}
              </button>
            ) : (
              <Link
                href="/courses/excel/excel-basics/learn/lesson-1-1"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Continue Learning
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <div className="grid gap-1">
              <h3 className="text-xl font-medium">Course Details</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Everything you need to know</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm">5 Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm">Beginner Level</span>
              </div>
            </div>
            <ul className="grid gap-2">
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">Excel Interface Basics</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">Cell Formatting</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">Basic Formulas</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">Sorting and Filtering</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">Simple Charts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 grid gap-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tighter">Course Overview</h2>
          <p className="text-gray-500 md:text-lg/relaxed dark:text-gray-400">
            This beginner-friendly course will introduce you to the essential features of Microsoft Excel. 
            You'll learn how to navigate the Excel interface, format cells for better data presentation, 
            use basic formulas to perform calculations, organize data with sorting and filtering, and create 
            simple charts to visualize your data.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-bold">What You'll Learn</h3>
            <ul className="mt-4 grid gap-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                <span>Navigate the Excel interface efficiently</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                <span>Format cells to improve data presentation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                <span>Use basic formulas like SUM, AVERAGE, and COUNT</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                <span>Sort and filter data to find information quickly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-1 h-4 w-4 text-primary" />
                <span>Create simple charts to visualize your data</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-bold">Course Structure</h3>
            <ul className="mt-4 grid gap-4">
              <li>
                <div className="font-medium">Lesson 1: Excel Interface Basics</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Understanding the Excel workspace, ribbon, and navigation
                </p>
              </li>
              <li>
                <div className="font-medium">Lesson 2: Cell Formatting</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Formatting cells, text, numbers, and creating custom formats
                </p>
              </li>
              <li>
                <div className="font-medium">Lesson 3: Basic Formulas</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Using SUM, AVERAGE, COUNT, and other essential formulas
                </p>
              </li>
              <li>
                <div className="font-medium">Lesson 4: Sorting and Filtering</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Organizing and finding data quickly with sort and filter tools
                </p>
              </li>
              <li>
                <div className="font-medium">Lesson 5: Simple Charts</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Creating basic charts to visualize your data effectively
                </p>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-bold">Requirements</h3>
            <ul className="mt-4 grid gap-2">
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-4 w-4" />
                <span>No prior Excel experience needed</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-4 w-4" />
                <span>Access to Microsoft Excel (any version)</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-4 w-4" />
                <span>Basic computer skills</span>
              </li>
            </ul>
            <h3 className="mt-6 text-xl font-bold">Who This Course Is For</h3>
            <ul className="mt-4 grid gap-2">
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-4 w-4" />
                <span>Complete beginners to Excel</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-4 w-4" />
                <span>Office workers needing to learn Excel basics</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-4 w-4" />
                <span>Students looking to improve their data skills</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-1 h-4 w-4" />
                <span>Anyone wanting to build a foundation in Excel</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 