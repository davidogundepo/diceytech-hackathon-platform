import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  User, 
  Project, 
  Hackathon, 
  Application, 
  Notification, 
  Achievement, 
  UserAchievement 
} from '@/types/firestore';

// User Operations
export const getUserById = async (userId: string): Promise<User | null> => {
  console.log('🔍 Checking if user exists:', userId);
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    console.log('✅ User found:', userDoc.data().email);
    return { id: userDoc.id, ...userDoc.data() } as User;
  }
  console.log('❌ User not found');
  return null;
};

export const createUserWithId = async (userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  console.log('🆕 Creating new user with ID:', userId, 'Email:', userData.email);
  const now = Timestamp.now();
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: now,
    updatedAt: now
  });
  console.log('✅ User document created successfully');
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'users'), {
    ...userData,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    ...userData,
    updatedAt: Timestamp.now()
  });
};

// Project Operations
export const getAllProjects = async (): Promise<Project[]> => {
  // Fetch all projects without filtering by status
  const querySnapshot = await getDocs(collection(db, 'projects'));
  const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  
  // Sort client-side to avoid composite index requirement
  return projects.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const getUserProjects = async (userId: string, limitCount?: number): Promise<Project[]> => {
  const q = query(
    collection(db, 'projects'),
    where('userId', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  
  // Sort client-side to avoid composite index requirement
  const sortedProjects = projects.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  
  return limitCount ? sortedProjects.slice(0, limitCount) : sortedProjects;
};

export const getProjectById = async (projectId: string): Promise<Project | null> => {
  const projectDoc = await getDoc(doc(db, 'projects', projectId));
  if (projectDoc.exists()) {
    return { id: projectDoc.id, ...projectDoc.data() } as Project;
  }
  return null;
};

export const createProject = async (projectData: Omit<Project, 'id' | 'views' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'projects'), {
    ...projectData,
    views: 0,
    likes: 0,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<void> => {
  await updateDoc(doc(db, 'projects', projectId), {
    ...projectData,
    updatedAt: Timestamp.now()
  });
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await deleteDoc(doc(db, 'projects', projectId));
};

// Hackathon Operations
export const getAllHackathons = async (): Promise<Hackathon[]> => {
  // Fetch all hackathons and sort client-side to avoid composite index requirements
  const q = query(
    collection(db, 'hackathons')
  );
  const querySnapshot = await getDocs(q);
  const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hackathon));
  // Sort client-side by startDate desc
  return items.sort((a, b) => (b.startDate?.seconds || 0) - (a.startDate?.seconds || 0));
};

export const getRecentHackathons = async (limitCount: number): Promise<Hackathon[]> => {
  const q = query(
    collection(db, 'hackathons'),
    where('isActive', '==', true)
  );
  const querySnapshot = await getDocs(q);
  const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hackathon));
  return items
    .sort((a, b) => (b.startDate?.seconds || 0) - (a.startDate?.seconds || 0))
    .slice(0, limitCount);
};

export const getHackathonById = async (hackathonId: string): Promise<Hackathon | null> => {
  const hackathonDoc = await getDoc(doc(db, 'hackathons', hackathonId));
  if (hackathonDoc.exists()) {
    return { id: hackathonDoc.id, ...hackathonDoc.data() } as Hackathon;
  }
  return null;
};

export const createHackathon = async (hackathonData: Omit<Hackathon, 'id' | 'participantCount' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'hackathons'), {
    ...hackathonData,
    participantCount: 0,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

// Saved Hackathons (Favorites)
export const toggleSaveHackathon = async (userId: string, hackathonId: string): Promise<boolean> => {
  const favRef = doc(db, 'user_saved_hackathons', `${userId}_${hackathonId}`);
  const snap = await getDoc(favRef);
  if (snap.exists()) {
    await deleteDoc(favRef);
    return false; // now unsaved
  }
  await setDoc(favRef, { userId, hackathonId, createdAt: Timestamp.now() });
  return true; // now saved
};

export const getUserSavedHackathonIds = async (userId: string): Promise<string[]> => {
  const q = query(collection(db, 'user_saved_hackathons'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => (d.data() as any).hackathonId as string);
};

export const getUserSavedHackathons = async (userId: string): Promise<Hackathon[]> => {
  const ids = await getUserSavedHackathonIds(userId);
  const docs = await Promise.all(ids.map(id => getDoc(doc(db, 'hackathons', id))));
  return docs
    .filter(s => s.exists())
    .map(s => ({ id: s.id, ...s.data() } as Hackathon))
    .sort((a, b) => (b.startDate?.seconds || 0) - (a.startDate?.seconds || 0));
};

// Application Operations
export const getUserApplications = async (userId: string): Promise<Application[]> => {
  console.log('🔍 getUserApplications called with userId:', userId);
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  console.log('🔍 Query returned', querySnapshot.docs.length, 'documents');
  querySnapshot.docs.forEach(doc => {
    console.log('🔍 Application doc:', doc.id, doc.data());
  });
  const applications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
  // Sort client-side to avoid composite index requirement
  return applications.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const createApplication = async (applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'applications'), {
    ...applicationData,
    createdAt: now,
    updatedAt: now
  });
  
  // Increment participant count if it's a hackathon application
  if (applicationData.type === 'hackathon' && applicationData.hackathonId) {
    const hackathonRef = doc(db, 'hackathons', applicationData.hackathonId);
    const hackathonDoc = await getDoc(hackathonRef);
    if (hackathonDoc.exists()) {
      const currentCount = hackathonDoc.data().participantCount || 0;
      await updateDoc(hackathonRef, {
        participantCount: currentCount + 1
      });
    }
  }
  
  return docRef.id;
};

// Notification Operations
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
  return items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const subscribeToUserNotifications = (
  userId: string, 
  callback: (notifications: Notification[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(
    q,
    (querySnapshot) => {
      const notifications = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Notification))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      callback(notifications);
    },
    (error) => {
      console.error('subscribeToUserNotifications error:', error);
      callback([]);
    }
  );
};

export const subscribeToAllNotifications = (
  callback: (notifications: Notification[]) => void
): (() => void) => {
  const q = query(collection(db, 'notifications'));
  
  return onSnapshot(
    q,
    (querySnapshot) => {
      const notifications = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Notification))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      callback(notifications);
    },
    (error) => {
      console.error('subscribeToAllNotifications error:', error);
      callback([]);
    }
  );
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', notificationId), {
    isRead: true
  });
};

export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'notifications'), {
    ...notificationData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

// Achievement Operations
export const getAllAchievements = async (): Promise<Achievement[]> => {
  const querySnapshot = await getDocs(collection(db, 'achievements'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
};

export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  const q = query(
    collection(db, 'user_achievements'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserAchievement));
};

export const awardAchievement = async (userId: string, achievementId: string): Promise<string> => {
  const docRef = await addDoc(collection(db, 'user_achievements'), {
    userId,
    achievementId,
    earnedAt: Timestamp.now(),
    progress: 100
  });
  return docRef.id;
};

// Like/Unlike Projects
export const toggleLikeProject = async (userId: string, projectId: string): Promise<boolean> => {
  const likeRef = doc(db, 'user_project_likes', `${userId}_${projectId}`);
  const snap = await getDoc(likeRef);
  const projectRef = doc(db, 'projects', projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (!projectSnap.exists()) return false;
  
  const currentLikes = projectSnap.data().likes || 0;
  
  if (snap.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(projectRef, { likes: Math.max(0, currentLikes - 1) });
    return false; // now unliked
  }
  
  await setDoc(likeRef, { userId, projectId, createdAt: Timestamp.now() });
  await updateDoc(projectRef, { likes: currentLikes + 1 });
  return true; // now liked
};

export const getUserLikedProjectIds = async (userId: string): Promise<string[]> => {
  const q = query(collection(db, 'user_project_likes'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => (d.data() as any).projectId as string);
};

// Saved Projects (Favorites)
export const toggleSaveProject = async (userId: string, projectId: string): Promise<boolean> => {
  const favRef = doc(db, 'user_saved_projects', `${userId}_${projectId}`);
  const snap = await getDoc(favRef);
  if (snap.exists()) {
    await deleteDoc(favRef);
    return false; // now unsaved
  }
  await setDoc(favRef, { userId, projectId, createdAt: Timestamp.now() });
  return true; // now saved
};

export const getUserSavedProjectIds = async (userId: string): Promise<string[]> => {
  const q = query(collection(db, 'user_saved_projects'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => (d.data() as any).projectId as string);
};

export const getUserSavedProjects = async (userId: string): Promise<Project[]> => {
  const ids = await getUserSavedProjectIds(userId);
  const docs = await Promise.all(ids.map(id => getDoc(doc(db, 'projects', id))));
  return docs
    .filter(s => s.exists())
    .map(s => ({ id: s.id, ...s.data() } as Project));
};

// Check if user has applied to hackathon
export const hasUserAppliedToHackathon = async (userId: string, hackathonId: string): Promise<boolean> => {
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId),
    where('hackathonId', '==', hackathonId)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Get user's hackathon application IDs
export const getUserHackathonApplicationIds = async (userId: string): Promise<string[]> => {
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId),
    where('type', '==', 'hackathon')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => (doc.data() as Application).hackathonId).filter(id => id) as string[];
};

// Increment profile views
export const incrementProfileViews = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const currentViews = (userDoc.data()?.profileViews || 0) as number;
  await updateDoc(userRef, {
    profileViews: currentViews + 1,
    updatedAt: Timestamp.now()
  });
};

// Search Operations
export const searchProjects = async (searchTerm: string): Promise<Project[]> => {
  // Note: For production, consider using Algolia or similar for better search
  const querySnapshot = await getDocs(collection(db, 'projects'));
  const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  
  return projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};
