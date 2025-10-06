import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { createUser, getUserById } from './firestoreService';

export const loginWithEmail = async (email: string, password: string) => {
  console.log('authService: loginWithEmail called with email:', email);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('authService: signInWithEmailAndPassword successful, user:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('authService: signInWithEmailAndPassword failed:', error.code, error.message);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  console.log('authService: registerWithEmail called with email:', email, 'displayName:', displayName);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('authService: createUserWithEmailAndPassword successful, user:', user.uid);
    
    // Create user profile in Firestore
    await createUser({
      email: user.email!,
      displayName: displayName,
      photoURL: user.photoURL,
      role: 'user',
      profileCompleteness: 60,
      skills: []
    });
    console.log('authService: User profile created in Firestore');
    
    return user;
  } catch (error: any) {
    console.error('authService: registerWithEmail failed:', error.code, error.message);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  
  // Check if user exists in Firestore, if not create profile
  const existingUser = await getUserById(user.uid);
  if (!existingUser) {
    await createUser({
      email: user.email!,
      displayName: user.displayName || '',
      photoURL: user.photoURL,
      role: 'user',
      profileCompleteness: 70,
      skills: []
    });
  }
  
  return user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
