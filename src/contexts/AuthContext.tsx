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
    // Subscribe to Firebase auth state changes
    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fetch user profile from Firestore
        const userProfile = await getUserById(fbUser.uid);
        if (userProfile) {
          setUser(userProfile);
          setIsAuthenticated(true);
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
      const fbUser = await loginWithEmail(email, password);
      const userProfile = await getUserById(fbUser.uid);
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { fullName: string; email: string; password: string; username: string }) => {
    setLoading(true);
    try {
      const fbUser = await registerWithEmail(userData.email, userData.password, userData.fullName);
      const userProfile = await getUserById(fbUser.uid);
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const fbUser = await loginWithGoogle();
      const userProfile = await getUserById(fbUser.uid);
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
      }
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
