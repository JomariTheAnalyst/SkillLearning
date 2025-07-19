"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, ReactNode } from "react";

// 3D Models
const HeroCanvas = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl top-1/4 right-1/4"></div>
      <div className="absolute w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-3xl bottom-1/4 left-1/4"></div>
    </div>
  );
};

// Animated components
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({ children, className = "" }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 animate-gradient ${className}`}>
      {children}
    </span>
  );
};

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = "", delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        type: "spring", 
        stiffness: 100 
      }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
      }}
      className={`rounded-xl border border-border bg-background/50 backdrop-blur-sm p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Floating elements
interface FloatingElementProps {
  className: string;
  children: ReactNode;
  xFactor?: number;
  yFactor?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ className, children, xFactor = 1, yFactor = 1 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.sin(Date.now() * 0.001 * xFactor) * 10,
        y: Math.cos(Date.now() * 0.001 * yFactor) * 10,
      });
    }, 50);

    return () => clearInterval(interval);
  }, [xFactor, yFactor]);

  return (
    <div
      className={className}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.5s ease-out",
      }}
    >
      {children}
    </div>
  );
};

// Course cards with hover effects
interface CourseCardProps {
  title: string;
  category: string;
  description: string;
  lessons: string;
  href: string;
  delay: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, category, description, lessons, href, delay }) => {
  return (
    <AnimatedCard delay={delay}>
      <div className="group relative overflow-hidden rounded-lg">
        <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-primary/30 relative">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/10 transition-opacity duration-300" />
          <div className="p-4 absolute bottom-0 left-0 right-0">
            <motion.span 
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              {category}
            </motion.span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">{title}</h3>
          <p className="text-muted-foreground mt-2">
            {description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{lessons}</span>
            <Link 
              href={href}
              className="inline-flex items-center text-sm font-medium text-primary relative overflow-hidden group-hover:text-primary/90"
            >
              <span>View Course</span>
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with 3D background */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <HeroCanvas />
        
        <div className="container flex flex-col items-center text-center space-y-4 relative z-10">
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              Master <AnimatedGradientText>Essential Tech Skills</AnimatedGradientText>
          </h1>
          </FadeIn>
          
          <FadeIn delay={0.3} className="max-w-[800px]">
            <p className="text-xl text-muted-foreground">
              Comprehensive courses in SQL, Python, and Excel with interactive learning experiences to advance your career
          </p>
          </FadeIn>
          
          <FadeIn delay={0.5}>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/courses"
                  className="rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Browse Courses
            </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/auth/register"
                  className="rounded-md border border-input bg-background/80 backdrop-blur-sm px-8 py-3 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Sign Up Free
            </Link>
              </motion.div>
          </div>
          </FadeIn>
          
          {/* Floating elements */}
          <FloatingElement className="absolute top-20 left-10 w-12 h-12 hidden md:block" xFactor={0.7} yFactor={0.9}>
            <div className="w-full h-full rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-500/20" />
          </FloatingElement>
          
          <FloatingElement className="absolute bottom-20 right-10 w-16 h-16 hidden md:block" xFactor={0.5} yFactor={1.2}>
            <div className="w-full h-full rounded-full bg-purple-500/10 backdrop-blur-sm border border-purple-500/20" />
          </FloatingElement>
          
          <FloatingElement className="absolute top-40 right-20 w-8 h-8 hidden md:block" xFactor={1.2} yFactor={0.6}>
            <div className="w-full h-full rounded-md bg-green-500/10 backdrop-blur-sm border border-green-500/20" />
          </FloatingElement>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-secondary/50 relative overflow-hidden">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tighter mb-12 text-center">
              Popular <AnimatedGradientText>Courses</AnimatedGradientText>
          </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CourseCard 
              title="SQL Fundamentals" 
              category="SQL" 
              description="Learn essential SQL queries and database management skills" 
              lessons="8 modules • 24 lessons" 
                    href="/courses/sql/fundamentals"
              delay={0.1}
            />
            
            <CourseCard 
              title="Python for Data Analysis" 
              category="Python" 
              description="Master data analysis with Python, pandas, and matplotlib" 
              lessons="10 modules • 32 lessons" 
                    href="/courses/python/data-analysis"
              delay={0.2}
            />
            
            <CourseCard 
              title="Advanced Excel Skills" 
              category="Excel" 
              description="Learn advanced formulas, pivot tables, and data visualization" 
              lessons="6 modules • 18 lessons" 
                    href="/courses/excel/advanced"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container">
          <FadeIn>
          <h2 className="text-3xl font-bold tracking-tighter mb-16 text-center">
              Why Learn With <AnimatedGradientText>Us</AnimatedGradientText>
          </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <motion.div 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <svg
                    className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 18h.01" />
                  <path d="M8 18h.01" />
                  <path d="M16 18h.01" />
                  <path d="M12 14h.01" />
                  <path d="M8 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M12 10h.01" />
                  <path d="M8 10h.01" />
                  <path d="M16 10h.01" />
                  <rect height="18" rx="2" width="18" x="3" y="3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-muted-foreground">
                Practice what you learn with interactive exercises and quizzes
              </p>
              </motion.div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <motion.div 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <svg
                    className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
                  <path d="M12 13v8" />
                  <path d="M12 3v3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-muted-foreground">
                Learn from industry professionals with real-world experience
              </p>
              </motion.div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <motion.div 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <svg
                    className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Certificates</h3>
              <p className="text-muted-foreground">
                Earn certificates to showcase your skills to employers
              </p>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/50 relative overflow-hidden">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tighter mb-12 text-center">
              What Our <AnimatedGradientText>Students Say</AnimatedGradientText>
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <motion.div 
                className="p-6 rounded-xl bg-background/80 backdrop-blur-sm border border-border relative"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl text-primary/20 absolute top-4 right-4">"</div>
                <p className="text-foreground mb-4">
                  The SQL course was exactly what I needed to land my first data analyst job. The interactive exercises helped me understand complex queries in a practical way.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 mr-4"></div>
                  <div>
                    <h4 className="font-medium">Sarah J.</h4>
                    <p className="text-sm text-muted-foreground">Data Analyst</p>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <motion.div 
                className="p-6 rounded-xl bg-background/80 backdrop-blur-sm border border-border relative"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl text-primary/20 absolute top-4 right-4">"</div>
                <p className="text-foreground mb-4">
                  I went from Excel novice to power user in just a few weeks. The course is well-structured and the projects were challenging but incredibly valuable.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 mr-4"></div>
                  <div>
                    <h4 className="font-medium">Michael T.</h4>
                    <p className="text-sm text-muted-foreground">Financial Analyst</p>
                  </div>
            </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]"></div>
        <motion.div 
          className="container text-center relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tighter mb-4 text-primary-foreground">
            Ready to advance your career?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-[600px] mx-auto mb-8">
            Join thousands of learners who have transformed their careers with our courses
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.98 }}
          >
          <Link
            href="/auth/register"
              className="rounded-md bg-background px-8 py-3 text-lg font-medium text-foreground transition-colors hover:bg-background/90 shadow-xl"
          >
            Get Started Today
          </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
