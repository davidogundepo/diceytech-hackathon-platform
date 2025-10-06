import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { subscribeToAuthChanges, loginWithEmail, registerWithEmail, loginWithGoogle, logoutUser } from '@/services/authService';
import { getUserById } from '@/services/firestoreService';
import { User } from '@/types/firestore';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (userData: { fullName: string; email: string; password: string; username: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');
    
    // Subscribe to Firebase auth state changes
    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      console.log('AuthContext: Auth state changed', fbUser ? `User: ${fbUser.email}` : 'No user');
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        try {
          // Fetch user profile from Firestore
          const userProfile = await getUserById(fbUser.uid);
          console.log('AuthContext: User profile fetched', userProfile);
          
          if (userProfile) {
            setUser(userProfile);
            setIsAuthenticated(true);
          } else {
            console.error('AuthContext: User profile not found in Firestore for uid:', fbUser.uid);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('AuthContext: Error fetching user profile', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('AuthContext: Attempting login with email:', email);
      const fbUser = await loginWithEmail(email, password);
      console.log('AuthContext: Login successful, Firebase user:', fbUser.uid);
      
      const userProfile = await getUserById(fbUser.uid);
      console.log('AuthContext: User profile after login:', userProfile);
      
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { fullName: string; email: string; password: string; username: string }) => {
    setLoading(true);
    try {
      console.log('AuthContext: Attempting registration with email:', userData.email);
      const fbUser = await registerWithEmail(userData.email, userData.password, userData.fullName);
      console.log('AuthContext: Registration successful, Firebase user:', fbUser.uid);
      
      const userProfile = await getUserById(fbUser.uid);
      console.log('AuthContext: User profile after registration:', userProfile);
      
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        throw new Error('User profile not found after registration');
      }
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      console.log('AuthContext: Attempting Google login');
      const fbUser = await loginWithGoogle();
      console.log('AuthContext: Google login successful, Firebase user:', fbUser.uid);
      
      const userProfile = await getUserById(fbUser.uid);
      console.log('AuthContext: User profile after Google login:', userProfile);
      
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('AuthContext: Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setFirebaseUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser,
      login, 
      loginWithGoogle: handleGoogleLogin,
      register, 
      logout, 
      isAuthenticated,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
