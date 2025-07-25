import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { User, Country, ESIMPlan, UserESIM, PaymentMethod, Payment } from '../types';

// Initialize Firebase collections
const usersCollection = firestore().collection('users');
const countriesCollection = firestore().collection('countries');
const plansCollection = firestore().collection('plans');
const userESIMsCollection = firestore().collection('user_esims');
const paymentsCollection = firestore().collection('payments');
const paymentMethodsCollection = firestore().collection('payment_methods');

// Authentication Service
export class AuthService {
  // Get current user
  static getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  // Sign up with email and password
  static async signUp(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      const userDoc: User = {
        id: user.uid,
        email: user.email!,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber,
        profileImage: userData.profileImage,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.doc(user.uid).set(userDoc);
      return userDoc;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await usersCollection.doc(user.uid).get();
      if (!userDoc.exists) {
        throw new Error('User document not found');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await usersCollection.doc(userId).update({
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
  }
}

// Countries Service
export class CountriesService {
  // Get all available countries
  static async getCountries(): Promise<Country[]> {
    try {
      const snapshot = await countriesCollection.where('isAvailable', '==', true).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Country);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get country by ID
  static async getCountryById(countryId: string): Promise<Country | null> {
    try {
      const doc = await countriesCollection.doc(countryId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as Country;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

// eSIM Plans Service
export class PlansService {
  // Get plans for a country
  static async getPlansByCountry(countryId: string): Promise<ESIMPlan[]> {
    try {
      const snapshot = await plansCollection
        .where('countryId', '==', countryId)
        .orderBy('price', 'asc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ESIMPlan);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get plan by ID
  static async getPlanById(planId: string): Promise<ESIMPlan | null> {
    try {
      const doc = await plansCollection.doc(planId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as ESIMPlan;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get popular plans
  static async getPopularPlans(): Promise<ESIMPlan[]> {
    try {
      const snapshot = await plansCollection
        .where('isPopular', '==', true)
        .limit(10)
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ESIMPlan);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

// User eSIMs Service
export class UserESIMsService {
  // Get user's eSIMs
  static async getUserESIMs(userId: string): Promise<UserESIM[]> {
    try {
      const snapshot = await userESIMsCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as UserESIM);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get eSIM by ID
  static async getESIMById(esimId: string): Promise<UserESIM | null> {
    try {
      const doc = await userESIMsCollection.doc(esimId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as UserESIM;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Create new eSIM
  static async createESIM(esimData: Omit<UserESIM, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserESIM> {
    try {
      const docRef = await userESIMsCollection.add({
        ...esimData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as UserESIM;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Update eSIM
  static async updateESIM(esimId: string, updates: Partial<UserESIM>): Promise<void> {
    try {
      await userESIMsCollection.doc(esimId).update({
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Activate eSIM
  static async activateESIM(esimId: string): Promise<void> {
    try {
      await userESIMsCollection.doc(esimId).update({
        status: 'active',
        activationDate: new Date(),
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

// Payment Methods Service
export class PaymentMethodsService {
  // Get user's payment methods
  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const snapshot = await paymentMethodsCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as PaymentMethod);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Add payment method
  static async addPaymentMethod(paymentMethodData: Omit<PaymentMethod, 'id' | 'createdAt'>): Promise<PaymentMethod> {
    try {
      const docRef = await paymentMethodsCollection.add({
        ...paymentMethodData,
        createdAt: new Date(),
      });

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as PaymentMethod;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Remove payment method
  static async removePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await paymentMethodsCollection.doc(paymentMethodId).delete();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

// Payments Service
export class PaymentsService {
  // Get user's payments
  static async getPayments(userId: string): Promise<Payment[]> {
    try {
      const snapshot = await paymentsCollection
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Payment);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Create payment record
  static async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    try {
      const docRef = await paymentsCollection.add({
        ...paymentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as Payment;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Update payment status
  static async updatePaymentStatus(paymentId: string, status: Payment['status']): Promise<void> {
    try {
      await paymentsCollection.doc(paymentId).update({
        status,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

// Storage Service
export class StorageService {
  // Upload profile image
  static async uploadProfileImage(userId: string, imageUri: string): Promise<string> {
    try {
      const reference = storage().ref(`profile-images/${userId}`);
      await reference.putFile(imageUri);
      const url = await reference.getDownloadURL();
      return url;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Delete profile image
  static async deleteProfileImage(userId: string): Promise<void> {
    try {
      const reference = storage().ref(`profile-images/${userId}`);
      await reference.delete();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}