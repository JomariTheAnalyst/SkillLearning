import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Ensure the user can only access their own data
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all user enrollments with course details
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ['ACTIVE', 'COMPLETED']
        }
      },
      include: {
        course: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // For each course, calculate progress
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Get all lessons for this course
        const modules = await prisma.module.findMany({
          where: {
            courseId: enrollment.courseId
          },
          include: {
            lessons: true
          }
        });

        // Count total lessons
        const totalLessons = modules.reduce(
          (sum, module) => sum + module.lessons.length,
          0
        );

        if (totalLessons === 0) {
          return {
            id: enrollment.course.id,
            title: enrollment.course.title,
            category: enrollment.course.category,
            progress: 0,
            imageUrl: enrollment.course.imageUrl
          };
        }

        // Get completed lessons
        const completedLessons = await prisma.progress.count({
          where: {
            userId: session.user.id,
            lesson: {
              module: {
                courseId: enrollment.courseId
              }
            },
            completed: true
          }
        });

        // Calculate progress percentage
        const progress = Math.round((completedLessons / totalLessons) * 100);

        return {
          id: enrollment.course.id,
          title: enrollment.course.title,
          category: enrollment.course.category,
          progress: progress,
          imageUrl: enrollment.course.imageUrl
        };
      })
    );

    return NextResponse.json({ courses: coursesWithProgress });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 