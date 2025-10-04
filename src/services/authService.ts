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
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user profile in Firestore
  await createUser({
    email: user.email!,
    displayName: displayName,
    photoURL: user.photoURL,
    role: 'user',
    profileCompleteness: 60,
    skills: []
  });
  
  return user;
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
