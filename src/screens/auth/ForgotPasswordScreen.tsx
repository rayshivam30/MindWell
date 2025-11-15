import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, Surface, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { authAPI } from '../../services/authAPI';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (values: { email: string }) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await authAPI.forgotPassword(values.email);
      setMessage(response.message);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Button
            mode="text"
            onPress={handleBackToLogin}
            icon="arrow-left"
            style={styles.backButton}
          >
            Back to Login
          </Button>
        </View>

        <Surface style={styles.formContainer} elevation={2}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>
          
          <Text variant="headlineMedium" style={styles.title}>
            Forgot Password?
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </Text>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleForgotPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={touched.email && !!errors.email}
                  style={styles.input}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.resetButton}
                  contentStyle={styles.buttonContent}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </View>
            )}
          </Formik>

          {message && (
            <View style={styles.messageContainer}>
              <Text style={styles.successMessage}>{message}</Text>
            </View>
          )}
        </Surface>
      </View>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
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
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
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
    marginBottom: 32,
    lineHeight: 20,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  input: {
    backgroundColor: '#F8F9FF',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: -12,
    marginLeft: 16,
  },
  resetButton: {
    borderRadius: 12,
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  messageContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    width: '100%',
  },
  successMessage: {
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '500',
  },
  snackbar: {
    backgroundColor: '#F44336',
  },
});

export default ForgotPasswordScreen;