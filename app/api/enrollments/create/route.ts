import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Get session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { courseId } = body;

    // Validate required fields
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if the user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ 
        message: 'User is already enrolled in this course',
        enrollment: existingEnrollment
      });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        status: 'ACTIVE',
      },
    });

    // Initialize user progress for the first lesson if available
    const firstModule = await prisma.module.findFirst({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
    });

    if (firstModule && firstModule.lessons && firstModule.lessons.length > 0) {
      const firstLesson = firstModule.lessons[0];
      
      await prisma.progress.create({
        data: {
          userId: session.user.id,
          lessonId: firstLesson.id,
          completed: false,
          lastAccessed: new Date(),
        },
      });
    }

    return NextResponse.json({ 
      message: 'Successfully enrolled in course',
      enrollment 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 