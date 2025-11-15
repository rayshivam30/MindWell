import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import UserTypeScreen from '../screens/auth/UserTypeScreen';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';
import ProfileCustomizationScreen from '../screens/auth/ProfileCustomizationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main App Screens
import DashboardScreen from '../screens/main/DashboardScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  UserType: { signupData: any };
  EmailVerification: { email: string };
  ProfileCustomization: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: '#F8F9FF' }
    }}
  >
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
    <AuthStack.Screen name="UserType" component={UserTypeScreen} />
    <AuthStack.Screen name="EmailVerification" component={EmailVerificationScreen} />
    <AuthStack.Screen name="ProfileCustomization" component={ProfileCustomizationScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Dashboard" component={DashboardScreen} />
  </MainStack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  // Show main app if authenticated and email verified
  const shouldShowMainApp = isAuthenticated && user?.isEmailVerified;
  
  return shouldShowMainApp ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;