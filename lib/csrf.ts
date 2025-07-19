import { randomBytes, createHash } from 'crypto';
import { getIronSession } from 'iron-session';
import type { NextRequest, NextResponse } from 'next/server';

// Iron session configuration
export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'skill-learning-session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 3600 // 1 hour
  }
};

// Session type
export interface SessionData {
  csrfToken?: string;
  userId?: string;
  isLoggedIn?: boolean;
}

// Generate a CSRF token and store hash in session
export async function generateCsrfToken(req: NextRequest, res: NextResponse): Promise<string> {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  
  const token = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(token).digest('hex');
  
  // Store the hash in the session
  session.csrfToken = hash;
  await session.save();
  
  return token;
}

// Validate a CSRF token against session
export async function validateCsrfToken(req: NextRequest, res: NextResponse, token: string): Promise<boolean> {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  const storedHash = session.csrfToken;
  
  if (!storedHash) return false;
  
  const hash = createHash('sha256').update(token).digest('hex');
  return hash === storedHash;
}

// CSRF token for client-side forms
export function getCsrfTokenForForm(): string {
  return randomBytes(32).toString('hex');
}

// Middleware to check CSRF token
export async function csrfMiddleware(req: NextRequest, res: NextResponse): Promise<boolean> {
  // Skip for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return true;
  }
  
  const csrfToken = req.headers.get('X-CSRF-Token');
  if (!csrfToken) {
    return false;
  }
  
  return validateCsrfToken(req, res, csrfToken);
} 