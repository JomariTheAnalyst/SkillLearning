import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// In-memory store for development
const inMemoryStore = new Map();

// Create Redis client if credentials are available
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Get client IP from request
function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return '127.0.0.1';
}

// Rate limiter middleware for API routes
export async function rateLimiter(req: NextRequest) {
  const ip = getClientIp(req);
  const key = `rate-limit:${ip}`;
  
  // Use Redis if available, otherwise use in-memory store
  if (redis) {
    const current = await redis.get<number>(key) || 0;
    
    if (current > 100) { // 100 requests per minute
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }
    
    await redis.set(key, current + 1, { ex: 60 }); // Expire after 60 seconds
  } else {
    // In-memory rate limiting for development
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    
    // Clean up old entries
    for (const [entryKey, timestamp] of inMemoryStore.entries()) {
      if (timestamp < windowStart) {
        inMemoryStore.delete(entryKey);
      }
    }
    
    // Count requests in the current window
    let requestCount = 0;
    for (const [entryKey, timestamp] of inMemoryStore.entries()) {
      if (entryKey.startsWith(key) && timestamp > windowStart) {
        requestCount++;
      }
    }
    
    if (requestCount >= 100) { // 100 requests per minute
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }
    
    // Store this request
    inMemoryStore.set(`${key}:${now}`, now);
  }
  
  return null; // No rate limit hit, continue
}

// Apply rate limiting to specific routes
export function applyRateLimit(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Apply rate limiting to API routes
  if (path.startsWith('/api/')) {
    return rateLimiter(req);
  }
  
  // Apply stricter rate limiting to authentication routes
  if (path.startsWith('/api/auth/')) {
    // Implement stricter limits for auth endpoints
    // This is a simplified example
    return rateLimiter(req);
  }
  
  return null; // No rate limiting for other routes
} 