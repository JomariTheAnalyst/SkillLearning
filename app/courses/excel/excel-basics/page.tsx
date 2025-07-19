"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle, Lock, BookOpen, Play, AlertCircle } from "lucide-react";

export default function ExcelBasicsPage() {
  const { data: session } = useSession();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (session) {
      checkEnrollmentStatus();
      fetchProgress();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  async function checkEnrollmentStatus() {
    try {
      const response = await fetch(`/api/enrollments/check?courseId=excel-basics&category=excel`);
      const data = await response.json();
      setIsEnrolled(data.isEnrolled);
    } catch (error) {
      console.error("Error checking enrollment:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProgress() {
    try {
      const response = await fetch("/api/user/progress?courseId=excel-basics");
      const data = await response.json();
      
      const progressMap: Record<string, boolean> = {};
      data.progress.forEach((item: any) => {
        progressMap[item.lessonId] = true;
      });
      
      setProgress(progressMap);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }

  async function handleEnroll() {
    if (!session) {
      window.location.href = "/auth/login?callbackUrl=/courses/excel/excel-basics";
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  }

  const modules = [
    {
      id: "module-1",
      title: "Getting Started with Excel",
      description: "Learn the basics of Excel interface and essential features",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Excel Interface Basics",
          description: "Understanding the Excel workspace, ribbon, and navigation",
          duration: "15 min",
        },
        {
          id: "lesson-1-2",
          title: "Cell Formatting",
          description: "Formatting cells, text, numbers, and creating custom formats",
          duration: "20 min",
        },
        {
          id: "lesson-1-3",
          title: "Basic Formulas",
          description: "Using SUM, AVERAGE, COUNT, and other essential formulas",
          duration: "25 min",
        },
        {
          id: "lesson-1-4",
          title: "Sorting and Filtering",
          description: "Organizing and finding data quickly with sort and filter tools",
          duration: "20 min",
        },
        {
          id: "lesson-1-5",
          title: "Simple Charts",
          description: "Creating basic charts to visualize your data effectively",
          duration: "25 min",
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tighter">Excel Basics</h1>
          <p className="text-gray-500 md:text-lg/relaxed dark:text-gray-400">
            Learn essential Excel skills for data organization, analysis, and visualization.
          </p>
        </div>

        {!isEnrolled && (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-medium">You are not enrolled in this course</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Enroll now to track your progress and access all lessons.
              </p>
              <div className="flex justify-start">
                <button
                  onClick={handleEnroll}
                  disabled={isLoading}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? "Enrolling..." : "Enroll Now"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {modules.map((module) => (
            <div key={module.id} className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <h2 className="text-2xl font-bold">{module.title}</h2>
                <p className="mt-1 text-gray-500 dark:text-gray-400">{module.description}</p>
              </div>
              <div className="border-t">
                {module.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-4 ${
                      index !== module.lessons.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        {progress[lesson.id] ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-gray-400" />
                        )}
                        <h3 className="font-medium">{lesson.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lesson.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {lesson.duration}
                      </div>
                      {isEnrolled ? (
                        <Link
                          href={`/courses/excel/excel-basics/learn/${lesson.id}`}
                          className="inline-flex items-center justify-center rounded-md bg-primary h-9 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                          <Play className="mr-1 h-4 w-4" />
                          Start
                        </Link>
                      ) : (
                        <div className="inline-flex items-center justify-center rounded-md border h-9 px-4 text-sm font-medium text-muted-foreground">
                          <Lock className="mr-1 h-4 w-4" />
                          Locked
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 