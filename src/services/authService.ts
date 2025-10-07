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
import { createUserWithId, getUserById } from './firestoreService';
import { sendWelcomeEmails } from './emailService';

export const loginWithEmail = async (email: string, password: string) => {
  console.log('🔐 Attempting email/password login:', email);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login successful, redirecting...');
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Login failed:', error.code, error.message);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  console.log('📝 Creating new account:', email);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore using Firebase Auth UID
    await createUserWithId(user.uid, {
      email: user.email!,
      displayName: displayName,
      photoURL: user.photoURL,
      role: 'user',
      profileCompleteness: 15,
      skills: []
    });
    
    // Send welcome emails
    sendWelcomeEmails(user.email!, displayName);
    
    console.log('✅ Account created successfully, redirecting...');
    return user;
  } catch (error: any) {
    console.error('❌ Registration failed:', error.code, error.message);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  console.log('🔵 Starting Google Sign-In...');
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    console.log('🔍 Checking if user exists in Firestore...');
    // Check if user exists in Firestore by UID (not email!)
    const existingUser = await getUserById(user.uid);
    
    if (!existingUser) {
      console.log('🆕 New Google user, creating profile...');
      await createUserWithId(user.uid, {
        email: user.email!,
        displayName: user.displayName || '',
        photoURL: user.photoURL,
        role: 'user',
        profileCompleteness: 15,
        skills: []
      });
      
      // Send welcome emails for new Google users
      sendWelcomeEmails(user.email!, user.displayName || 'New User');
    } else {
      console.log('✅ Existing user found:', existingUser.email);
    }
    
    console.log('✅ Login successful, redirecting...');
    return user;
  } catch (error: any) {
    console.error('❌ Google Sign-In failed:', error.code, error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
