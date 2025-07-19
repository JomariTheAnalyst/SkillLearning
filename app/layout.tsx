import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeContextProvider } from "./context/theme-provider";
import { AuthProvider } from "./context/auth-provider";
import { NavBar } from "./components/navbar";
import { Footer } from "./components/footer";
import { Toaster } from "sonner";
import { CookieConsent } from "./components/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Learning Platform",
  description: "A comprehensive platform for learning SQL, Python, and Excel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        <AuthProvider>
          <ThemeContextProvider>
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-center" />
            <CookieConsent />
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
