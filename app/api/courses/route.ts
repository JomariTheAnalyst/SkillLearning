import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    
    // Build the query filter
    const filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (level) {
      filter.level = level;
    }
    
    // Get courses with filtering
    const courses = await prisma.course.findMany({
      where: filter,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        level: true,
        imageUrl: true,
        _count: {
          select: {
            enrollments: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    // Format the response
    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      imageUrl: course.imageUrl,
      progress: 0, // No progress for unenrolled courses
      studentsCount: course._count.enrollments
    }));
    
    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 