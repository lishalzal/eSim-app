// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Country Types
export interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  currency: string;
  timezone: string;
  isAvailable: boolean;
}

// eSIM Types
export interface ESIMPlan {
  id: string;
  countryId: string;
  country: Country;
  name: string;
  description: string;
  dataAmount: number; // in MB
  duration: number; // in days
  price: number;
  currency: string;
  isPopular?: boolean;
  isUnlimited?: boolean;
  speed?: string; // e.g., "4G", "5G"
  activationType: 'immediate' | 'scheduled';
}

export interface UserESIM {
  id: string;
  userId: string;
  planId: string;
  plan: ESIMPlan;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  activationDate?: Date;
  expiryDate?: Date;
  dataUsed: number; // in MB
  dataRemaining: number; // in MB
  qrCode?: string;
  activationCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'apple_pay' | 'google_pay' | 'card';
  lastFourDigits?: string;
  cardBrand?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  eSIMId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Explore: undefined;
  MyESIMs: undefined;
  Profile: undefined;
  CountryDetails: { country: Country };
  PlanDetails: { plan: ESIMPlan };
  Payment: { plan: ESIMPlan };
  ESIMDetails: { eSIM: UserESIM };
  Settings: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// App State Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  countries: Country[];
  userESIMs: UserESIM[];
  paymentMethods: PaymentMethod[];
}