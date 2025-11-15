import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Surface, TextInput, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { verifyEmail, clearError } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store/store';

type EmailVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EmailVerification'>;
type EmailVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'EmailVerification'>;

const EmailVerificationScreen = () => {
  const navigation = useNavigation<EmailVerificationScreenNavigationProp>();
  const route = useRoute<EmailVerificationScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);
  
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const { email } = route.params;

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyEmail = async () => {
    if (verificationCode.length !== 6) {
      return;
    }
    
    try {
      await dispatch(verifyEmail(verificationCode)).unwrap();
      // Navigate to profile customization
      navigation.navigate('ProfileCustomization');
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  const handleResendCode = async () => {
    // TODO: Implement resend verification code API call
    setResendCooldown(60);
    console.log('Resending verification code to:', email);
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Surface style={styles.formContainer} elevation={2}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📧</Text>
          </View>
          
          <Text variant="headlineMedium" style={styles.title}>
            Check Your Email
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            We've sent a 6-digit verification code to
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {email}
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Verification Code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.input}
              textAlign="center"
              placeholder="000000"
            />

            <Button
              mode="contained"
              onPress={handleVerifyEmail}
              loading={isLoading}
              disabled={isLoading || verificationCode.length !== 6}
              style={styles.verifyButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <View style={styles.resendContainer}>
              <Text variant="bodyMedium" style={styles.resendText}>
                Didn't receive the code?
              </Text>
              <Button
                mode="text"
                onPress={handleResendCode}
                disabled={resendCooldown > 0}
                compact
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </Button>
            </View>
          </View>
        </Surface>
      </View>

      <Snackbar
        visible={!!error}
        onDismiss={handleDismissError}
        duration={4000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
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
    justifyContent: 'center',
  },
  formContainer: {
    padding: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6B73FF',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
  email: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1C1B1F',
    marginBottom: 32,
  },
  form: {
    width: '100%',
    gap: 24,
  },
  input: {
    backgroundColor: '#F8F9FF',
    fontSize: 24,
    letterSpacing: 8,
  },
  verifyButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendContainer: {
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    color: '#666',
  },
  snackbar: {
    backgroundColor: '#F44336',
  },
});

export default EmailVerificationScreen;