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
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // Ensure the user can only access their own data
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get completed quizzes
    const completedQuizzes = await prisma.completedQuiz.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true
                  }
                }
              }
            },
            questions: {
              select: {
                id: true
              }
            }
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: limit
    });

    // Format the response
    const quizzes = completedQuizzes.map(completedQuiz => ({
      id: completedQuiz.quizId,
      title: completedQuiz.quiz.title,
      courseTitle: completedQuiz.quiz.lesson.module.course.title,
      category: completedQuiz.quiz.lesson.module.course.category,
      score: Math.round(completedQuiz.score),
      totalQuestions: completedQuiz.quiz.questions.length,
      completedAt: completedQuiz.completedAt.toISOString()
    }));

    // Calculate stats
    const allCompletedQuizzes = await prisma.completedQuiz.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        score: true
      }
    });

    const stats = {
      completed: allCompletedQuizzes.length,
      avgScore: allCompletedQuizzes.length > 0
        ? Math.round(allCompletedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / allCompletedQuizzes.length)
        : 0,
      successRate: allCompletedQuizzes.length > 0
        ? Math.round((allCompletedQuizzes.filter(quiz => quiz.score >= 70).length / allCompletedQuizzes.length) * 100)
        : 0
    };

    return NextResponse.json({ 
      quizzes,
      stats
    });
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 