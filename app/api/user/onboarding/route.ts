import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { isCompleted, currentStep } = await req.json();
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { onboardingStatus: true }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update or create onboarding status
    if (user.onboardingStatus) {
      await prisma.onboardingStatus.update({
        where: { userId: user.id },
        data: {
          isCompleted: isCompleted !== undefined ? isCompleted : user.onboardingStatus.isCompleted,
          currentStep: currentStep !== undefined ? currentStep : user.onboardingStatus.currentStep,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.onboardingStatus.create({
        data: {
          userId: user.id,
          isCompleted: isCompleted !== undefined ? isCompleted : false,
          currentStep: currentStep !== undefined ? currentStep : 1,
        },
      });
    }

    // If onboarding is completed, initialize gamification data
    if (isCompleted) {
      // Create user experience record if it doesn't exist
      const userExperience = await prisma.userExperience.findUnique({
        where: { userId: user.id }
      });
      
      if (!userExperience) {
        await prisma.userExperience.create({
          data: {
            userId: user.id,
            totalXp: 100, // Starting XP for completing onboarding
            currentLevelXp: 100,
          }
        });
      }
      
      // Create user level record if it doesn't exist
      const userLevel = await prisma.userLevel.findUnique({
        where: { userId: user.id }
      });
      
      if (!userLevel) {
        await prisma.userLevel.create({
          data: {
            userId: user.id,
            level: 1,
          }
        });
      }
      
      // Create learning streak record if it doesn't exist
      const learningStreak = await prisma.learningStreak.findUnique({
        where: { userId: user.id }
      });
      
      if (!learningStreak) {
        await prisma.learningStreak.create({
          data: {
            userId: user.id,
            currentStreak: 1, // Start with 1 day streak for completing onboarding
            longestStreak: 1,
            lastActivityDate: new Date(),
            streakStartDate: new Date(),
          }
        });
      }
    }

    return NextResponse.json(
      { message: "Onboarding status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
} 