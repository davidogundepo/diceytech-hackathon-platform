import { awardAchievement, createNotification } from './firestoreService';

export const checkAndAwardAchievements = async (
  userId: string,
  eventType: string,
  data: any
): Promise<void> => {
  // Define achievement logic here
  // For example: award "First Project" achievement when user creates first project
  
  if (eventType === 'project_created' && data.isFirstProject) {
    await awardAchievement(userId, 'first_project');
    await createNotification({
      userId,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "First Project" achievement!',
      isRead: false,
      category: 'Achievements'
    });
  }
  
  // Add more achievement logic as needed
};
