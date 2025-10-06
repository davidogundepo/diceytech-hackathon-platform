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
  const q = query(
    collection(db, 'projects'), 
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const getUserProjects = async (userId: string, limitCount?: number): Promise<Project[]> => {
  let q = query(
    collection(db, 'projects'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
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
  const q = query(
    collection(db, 'hackathons'),
    where('isActive', '==', true),
    orderBy('startDate', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hackathon));
};

export const getRecentHackathons = async (limitCount: number): Promise<Hackathon[]> => {
  const q = query(
    collection(db, 'hackathons'),
    where('isActive', '==', true),
    orderBy('startDate', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hackathon));
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

// Application Operations
export const getUserApplications = async (userId: string): Promise<Application[]> => {
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
};

export const createApplication = async (applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'applications'), {
    ...applicationData,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

// Notification Operations
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

export const subscribeToUserNotifications = (
  userId: string, 
  callback: (notifications: Notification[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const notifications = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Notification));
    callback(notifications);
  });
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
