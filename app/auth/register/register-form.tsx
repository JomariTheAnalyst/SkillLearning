"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";

const registerSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setServerError(null);

    try {
      console.log("Submitting registration data:", { name: data.name, email: data.email });
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();
      console.log("Registration response status:", response.status);

      if (!response.ok) {
        console.error("Registration failed:", responseData);
        
        // Handle specific error cases
        if (response.status === 409) {
          throw new Error("This email is already registered. Please use a different email or try logging in.");
        } else if (responseData.message) {
          throw new Error(responseData.message);
        } else {
          throw new Error("Failed to register. Please try again.");
      }
      }

      console.log("Registration successful, attempting sign in");
      toast.success("Registration successful! Signing you in...");
      
      // Sign in the user after successful registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      console.log("Sign in result:", signInResult);
      
      if (signInResult?.error) {
        console.error("Login error after registration:", signInResult.error);
        toast.error("Registration successful but failed to log in automatically. Please log in manually.");
        // Use window.location for more reliable redirect
        window.location.href = "/auth/login";
        return;
      }
      
      // Redirect to onboarding after successful registration and login
      console.log("Redirecting to onboarding");
      if (signInResult?.url) {
        window.location.href = signInResult.url;
      } else {
        window.location.href = "/onboarding";
      }
      
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again later.";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="flex items-center space-x-2">
            <button 
              className="flex items-center justify-center w-full p-2 border border-border rounded-md bg-background hover:bg-accent transition-colors"
              type="button"
              onClick={() => {
                setIsLoading(true);
                console.log("Attempting Google sign in with redirect to onboarding");
                signIn("google", { callbackUrl: "/onboarding", redirect: false })
                  .then((result) => {
                    console.log("Google sign in result:", result);
                    if (result?.error) {
                      toast.error("Google login failed.");
                      setIsLoading(false);
                    } else if (result?.url) {
                      window.location.href = result.url;
                    }
                  })
                  .catch((error) => {
                    console.error("Google sign in error:", error);
                    toast.error("An unexpected error occurred.");
                    setIsLoading(false);
                  });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
              </svg>
              Google
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="flex items-center justify-center w-full p-2 border border-border rounded-md bg-background hover:bg-accent transition-colors"
              type="button"
              onClick={() => {
                setIsLoading(true);
                console.log("Attempting GitHub sign in with redirect to onboarding");
                signIn("github", { callbackUrl: "/onboarding", redirect: false })
                  .then((result) => {
                    console.log("GitHub sign in result:", result);
                    if (result?.error) {
                      toast.error("GitHub login failed.");
                      setIsLoading(false);
                    } else if (result?.url) {
                      window.location.href = result.url;
                    }
                  })
                  .catch((error) => {
                    console.error("GitHub sign in error:", error);
                    toast.error("An unexpected error occurred.");
                    setIsLoading(false);
                  });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              GitHub
            </button>
          </div>
        </div>
        
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-border"></div>
          <span className="mx-4 text-sm text-muted-foreground">or continue with</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
      </motion.div>

      {serverError && (
        <motion.div 
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {serverError}
        </motion.div>
      )}

      <motion.form 
        onSubmit={form.handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="name"
            >
              Full Name
            </label>
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                id="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("name")}
              />
            </motion.div>
            {form.formState.errors.name && (
              <motion.p 
                className="text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {form.formState.errors.name.message}
              </motion.p>
            )}
          </div>
          <div className="grid gap-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              Email
            </label>
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("email")}
              />
            </motion.div>
            {form.formState.errors.email && (
              <motion.p 
                className="text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {form.formState.errors.email.message}
              </motion.p>
            )}
          </div>
          <div className="grid gap-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="password"
            >
              Password
            </label>
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                id="password"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                disabled={isLoading}
                {...form.register("password")}
              />
            </motion.div>
            {form.formState.errors.password && (
              <motion.p 
                className="text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {form.formState.errors.password.message}
              </motion.p>
            )}
          </div>
          <div className="grid gap-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                id="confirmPassword"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                disabled={isLoading}
                {...form.register("confirmPassword")}
              />
            </motion.div>
            {form.formState.errors.confirmPassword && (
              <motion.p 
                className="text-sm text-red-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {form.formState.errors.confirmPassword.message}
              </motion.p>
            )}
          </div>
          <motion.button
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            Create Account
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
} 