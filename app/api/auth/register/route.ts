import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";

// Validation schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    console.log("Registration request received");
    const body = await req.json();
    console.log("Request body:", { name: body.name, email: body.email });

    // Validate input
    const result = userSchema.safeParse(body);
    if (!result.success) {
      console.error("Validation error:", result.error.format());
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    console.log("Checking if user exists:", email);
    try {
      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        console.log("User already exists:", email);
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 409 }
        );
      }
    } catch (dbError: any) {
      console.error("Database error when checking existing user:", dbError);
      return NextResponse.json(
        { message: "Database connection error", error: dbError.message },
        { status: 500 }
      );
    }

    // Hash password
    console.log("Hashing password");
    const hashedPassword = await hash(password, 10);

    // Create user
    console.log("Creating user:", { name, email });
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      
      console.log("User created successfully:", user.id);

      // Create onboarding status
      console.log("Creating onboarding status for user:", user.id);
      try {
        await prisma.onboardingStatus.create({
          data: {
            userId: user.id,
            isCompleted: false,
            currentStep: 1,
          },
        });
        console.log("Onboarding status created successfully");
      } catch (onboardingError: any) {
        console.error("Failed to create onboarding status:", onboardingError);
        // Continue with the registration process even if onboarding status creation fails
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(
        { 
          message: "User registered successfully", 
          user: userWithoutPassword 
        },
        { status: 201 }
      );
    } catch (createError: any) {
      console.error("Error creating user:", createError);
      // Check for specific database errors
      if (createError.code === 'P1001') {
        return NextResponse.json(
          { message: "Cannot reach database server", error: createError.message },
          { status: 500 }
        );
      } else if (createError.code === 'P1003') {
        return NextResponse.json(
          { message: "Database does not exist", error: createError.message },
          { status: 500 }
        );
      } else if (createError.code === 'P1017') {
        return NextResponse.json(
          { message: "Server has closed the connection", error: createError.message },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { message: "Failed to create user account", error: createError.message },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later.", error: error.message },
      { status: 500 }
    );
  }
} 