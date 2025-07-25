import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

// Import screens (we'll create these next)
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { MyESIMsScreen } from './src/screens/MyESIMsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CountryDetailsScreen } from './src/screens/CountryDetailsScreen';
import { PlanDetailsScreen } from './src/screens/PlanDetailsScreen';
import { PaymentScreen } from './src/screens/PaymentScreen';
import { ESIMDetailsScreen } from './src/screens/ESIMDetailsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

// Import hooks and types
import { useAuth } from './src/hooks/useAuth';
import { RootStackParamList } from './src/types';
import { COLORS } from './src/constants';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === 'MyESIMs') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{ title: 'Explore' }}
      />
      <Tab.Screen 
        name="MyESIMs" 
        component={MyESIMsScreen}
        options={{ title: 'My eSIMs' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Root Stack Navigator
const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CountryDetails" 
        component={CountryDetailsScreen}
        options={{ title: 'Country Details' }}
      />
      <Stack.Screen 
        name="PlanDetails" 
        component={PlanDetailsScreen}
        options={{ title: 'Plan Details' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ title: 'Payment' }}
      />
      <Stack.Screen 
        name="ESIMDetails" 
        component={ESIMDetailsScreen}
        options={{ title: 'eSIM Details' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

// Main App Component
const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can create a proper loading screen component
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.surface} 
      />
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={RootStackNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
      
      <Toast />
    </NavigationContainer>
  );
};

export default App;