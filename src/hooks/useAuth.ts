import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/firebase';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await AuthService.getCurrentUser();
          if (userDoc) {
            // For now, we'll create a basic user object
            // In a real app, you'd fetch the full user data from Firestore
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              phoneNumber: firebaseUser.phoneNumber || undefined,
              profileImage: firebaseUser.photoURL || undefined,
              createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
              updatedAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
            };

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // Store user data in AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
          }
        } catch (error: any) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        // Clear stored user data
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await AuthService.signUp(email, password, userData);
      setAuthState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
      return user;
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await AuthService.signIn(email, password);
      setAuthState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
      return user;
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await AuthService.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await AuthService.resetPassword(email);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;
    
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await AuthService.updateProfile(authState.user.id, updates);
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({ 
        ...prev, 
        user: updatedUser, 
        isLoading: false 
      }));
      
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
  };
};