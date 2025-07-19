import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { exportUserData } from '@/lib/data-export';
import { createReadStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';

// Handle GET request for user data export
export async function GET(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const includeProgress = searchParams.get('includeProgress') !== 'false';
    const includeQuizzes = searchParams.get('includeQuizzes') !== 'false';
    const includeAchievements = searchParams.get('includeAchievements') !== 'false';
    
    // Export user data
    const zipPath = await exportUserData({
      userId: session.user.id,
      includeProgress,
      includeQuizzes,
      includeAchievements
    });
    
    // Create readable stream from the zip file
    const fileStream = createReadStream(zipPath);
    
    // Create response with appropriate headers
    const response = new NextResponse(fileStream as any);
    
    // Set headers
    response.headers.set('Content-Type', 'application/zip');
    response.headers.set('Content-Disposition', 'attachment; filename="user-data-export.zip"');
    
    // Schedule file cleanup
    setTimeout(async () => {
      try {
        await fs.unlink(zipPath);
        const dirPath = path.dirname(zipPath);
        await fs.rmdir(dirPath, { recursive: true });
      } catch (error) {
        console.error('Error cleaning up export files:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return response;
  } catch (error) {
    console.error('Error in data export API:', error);
    return NextResponse.json(
      { error: 'Failed to export user data' },
      { status: 500 }
    );
  }
}

// Handle DELETE request for user data deletion (GDPR right to be forgotten)
export async function DELETE(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Require confirmation
    const searchParams = req.nextUrl.searchParams;
    const confirmed = searchParams.get('confirmed') === 'true';
    
    if (!confirmed) {
      return NextResponse.json(
        { error: 'Confirmation required. Add ?confirmed=true to confirm deletion.' },
        { status: 400 }
      );
    }
    
    // Import deletion function here to avoid circular dependencies
    const { deleteUserData } = await import('@/lib/data-export');
    
    // Delete user data
    const success = await deleteUserData(session.user.id);
    
    if (success) {
      return NextResponse.json(
        { message: 'User data deleted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to delete user data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in data deletion API:', error);
    return NextResponse.json(
      { error: 'Failed to delete user data' },
      { status: 500 }
    );
  }
} 