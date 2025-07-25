// App Configuration
export const APP_CONFIG = {
  name: 'eSIM Travel',
  version: '1.0.0',
  description: 'Global eSIM for travelers',
};

// Colors
export const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  gradient: {
    primary: ['#2563EB', '#1D4ED8'],
    secondary: ['#10B981', '#059669'],
    accent: ['#F59E0B', '#D97706'],
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
};

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// API Endpoints (placeholder for future eSIM provider integration)
export const API_ENDPOINTS = {
  // These would be replaced with actual eSIM provider APIs
  countries: '/countries',
  plans: '/plans',
  purchase: '/purchase',
  activate: '/activate',
  status: '/status',
};

// Mock Data for Development
export const MOCK_COUNTRIES = [
  {
    id: '1',
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    currency: 'USD',
    timezone: 'UTC-5',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    currency: 'GBP',
    timezone: 'UTC+0',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    currency: 'JPY',
    timezone: 'UTC+9',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    currency: 'AUD',
    timezone: 'UTC+10',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    currency: 'EUR',
    timezone: 'UTC+1',
    isAvailable: true,
  },
];

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  PREFERENCES: 'user_preferences',
};

// Validation Rules
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  auth: {
    invalidCredentials: 'Invalid email or password.',
    userNotFound: 'User not found.',
    emailInUse: 'Email already in use.',
    weakPassword: 'Password is too weak.',
  },
  payment: {
    failed: 'Payment failed. Please try again.',
    cancelled: 'Payment was cancelled.',
    insufficientFunds: 'Insufficient funds.',
  },
  eSIM: {
    activationFailed: 'eSIM activation failed.',
    notAvailable: 'eSIM not available for this region.',
    expired: 'eSIM has expired.',
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  auth: {
    login: 'Successfully logged in.',
    register: 'Account created successfully.',
    logout: 'Successfully logged out.',
  },
  payment: {
    completed: 'Payment completed successfully.',
  },
  eSIM: {
    purchased: 'eSIM purchased successfully.',
    activated: 'eSIM activated successfully.',
  },
};