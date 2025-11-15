import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleContinueAsGuest = () => {
    // TODO: Implement guest mode
    console.log('Continue as guest');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Illustration */}
        <View style={styles.logoContainer}>
          <Surface style={styles.logoPlaceholder} elevation={2}>
            <Text variant="headlineLarge" style={styles.logoText}>🧠</Text>
          </Surface>
          <Text variant="headlineMedium" style={styles.appName}>
            MindWell
          </Text>
          <Text variant="bodyLarge" style={styles.tagline}>
            Your mental health companion
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleSignup}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
          >
            Create Account
          </Button>
          
          <Button
            mode="text"
            onPress={handleContinueAsGuest}
            style={styles.textButton}
          >
            Continue as Guest
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontWeight: 'bold',
    color: '#6B73FF',
    marginBottom: 8,
  },
  tagline: {
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    borderRadius: 12,
  },
  secondaryButton: {
    borderRadius: 12,
    borderColor: '#6B73FF',
  },
  textButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
});

export default WelcomeScreen;