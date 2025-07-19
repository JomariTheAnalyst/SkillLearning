import { prisma } from '@/lib/prisma';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';

// Temporary directory for exports
const TEMP_DIR = path.join(process.cwd(), 'tmp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Types
interface ExportOptions {
  userId: string;
  includeProgress?: boolean;
  includeQuizzes?: boolean;
  includeAchievements?: boolean;
}

// Export user data in GDPR-compliant format
export async function exportUserData({
  userId,
  includeProgress = true,
  includeQuizzes = true,
  includeAchievements = true
}: ExportOptions): Promise<string> {
  try {
    // Create a unique export ID
    const exportId = uuidv4();
    const exportDir = path.join(TEMP_DIR, exportId);
    fs.mkdirSync(exportDir, { recursive: true });
    
    // Create a zip file
    const zip = new JSZip();
    
    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Add user data to zip
    zip.file('user.json', JSON.stringify(user, null, 2));
    
    // Get user enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      }
    });
    
    // Add enrollments to zip
    zip.file('enrollments.json', JSON.stringify(enrollments, null, 2));
    
    // Get and add progress data if requested
    if (includeProgress) {
      const progress = await prisma.progress.findMany({
        where: { userId }
      });
      zip.file('progress.json', JSON.stringify(progress, null, 2));
    }
    
    // Get and add quiz data if requested
    if (includeQuizzes) {
      const quizzes = await prisma.completedQuiz.findMany({
        where: { userId },
        include: {
          quiz: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });
      zip.file('quizzes.json', JSON.stringify(quizzes, null, 2));
      
      // Get quiz attempts
      const quizAttempts = await prisma.quizAttempt.findMany({
        where: { userId },
        include: {
          answerSubmissions: true
        }
      });
      zip.file('quiz_attempts.json', JSON.stringify(quizAttempts, null, 2));
    }
    
    // Get and add achievements data if requested
    if (includeAchievements) {
      const achievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: {
            select: {
              id: true,
              title: true,
              description: true
            }
          }
        }
      });
      zip.file('achievements.json', JSON.stringify(achievements, null, 2));
    }
    
    // Add README with explanation
    const readme = `
# SkillLearn User Data Export

This archive contains your personal data from SkillLearn, exported on ${new Date().toISOString()}.

## Files included:

- user.json: Your account information
- enrollments.json: Your course enrollments
${includeProgress ? '- progress.json: Your learning progress data\n' : ''}
${includeQuizzes ? '- quizzes.json: Your completed quizzes\n- quiz_attempts.json: Your quiz attempts and answers\n' : ''}
${includeAchievements ? '- achievements.json: Your achievements\n' : ''}

For questions about your data, please contact privacy@skilllearn.com.
`;
    
    zip.file('README.md', readme);
    
    // Generate the zip file
    const zipPath = path.join(exportDir, 'user-data-export.zip');
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    fs.writeFileSync(zipPath, content);
    
    return zipPath;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw new Error('Failed to export user data');
  }
}

// Delete user data (GDPR right to be forgotten)
export async function deleteUserData(userId: string): Promise<boolean> {
  try {
    // Start a transaction to ensure all data is deleted
    await prisma.$transaction(async (tx) => {
      // Delete user achievements
      await tx.userAchievement.deleteMany({ where: { userId } });
      
      // Delete user challenges
      await tx.userChallenge.deleteMany({ where: { userId } });
      await tx.userDailyChallenge.deleteMany({ where: { userId } });
      await tx.userWeeklyGoal.deleteMany({ where: { userId } });
      
      // Delete user skills
      await tx.userSkill.deleteMany({ where: { userId } });
      
      // Delete quiz attempts and submissions
      const quizAttempts = await tx.quizAttempt.findMany({ where: { userId } });
      for (const attempt of quizAttempts) {
        await tx.answerSubmission.deleteMany({ where: { quizAttemptId: attempt.id } });
      }
      await tx.quizAttempt.deleteMany({ where: { userId } });
      
      // Delete completed quizzes
      await tx.completedQuiz.deleteMany({ where: { userId } });
      
      // Delete progress
      await tx.progress.deleteMany({ where: { userId } });
      
      // Delete enrollments
      await tx.enrollment.deleteMany({ where: { userId } });
      
      // Delete leaderboard entries
      await tx.leaderboardEntry.deleteMany({ where: { userId } });
      
      // Delete user experience and level
      await tx.userExperience.deleteMany({ where: { userId } });
      await tx.userLevel.deleteMany({ where: { userId } });
      
      // Delete learning streak
      await tx.learningStreak.deleteMany({ where: { userId } });
      
      // Delete social profile
      await tx.socialProfile.deleteMany({ where: { userId } });
      
      // Delete user profile
      await tx.userProfile.deleteMany({ where: { userId } });
      
      // Delete onboarding status
      await tx.onboardingStatus.deleteMany({ where: { userId } });
      
      // Delete survey responses
      const surveyResponses = await tx.surveyResponse.findMany({ where: { userId } });
      for (const response of surveyResponses) {
        await tx.surveyAnswer.deleteMany({ where: { surveyResponseId: response.id } });
      }
      await tx.surveyResponse.deleteMany({ where: { userId } });
      
      // Delete sessions
      await tx.session.deleteMany({ where: { userId } });
      
      // Delete accounts
      await tx.account.deleteMany({ where: { userId } });
      
      // Finally, delete the user
      await tx.user.delete({ where: { id: userId } });
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    return false;
  }
} 