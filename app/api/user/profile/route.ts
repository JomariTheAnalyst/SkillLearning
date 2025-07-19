import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Profile data validation
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  age: z.number().int().min(13, "You must be at least 13 years old").optional(),
  educationLevel: z.string().optional(),
  profession: z.string().min(2, "Profession must be at least 2 characters").optional(),
  careerGoals: z.string().min(10, "Career goals must be at least 10 characters").optional(),
  learningStyle: z.enum(["VISUAL", "AUDITORY", "READING", "KINESTHETIC"]).optional(),
  timeAvailability: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate data
    const result = profileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid profile data", errors: result.error.format() },
        { status: 400 }
      );
    }
    
    // Get validated data
    const profileData = result.data;
    const userId = session.user.id;
    
    // Check if profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });
    
    // Create or update profile
    let profile;
    if (existingProfile) {
      profile = await prisma.userProfile.update({
        where: { userId },
        data: profileData,
      });
    } else {
      profile = await prisma.userProfile.create({
        data: {
          userId,
          ...profileData,
        },
      });
    }
    
    // Update onboarding status
    await prisma.onboardingStatus.update({
      where: { userId },
      data: {
        isCompleted: true,
        currentStep: 3,
      },
    });
    
    return NextResponse.json({ 
      message: "Profile updated successfully", 
      profile 
    });
    
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating your profile" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });
    
    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }
    
    return NextResponse.json({ profile });
    
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching your profile" },
      { status: 500 }
    );
  }
} 