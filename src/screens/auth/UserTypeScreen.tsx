import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Surface, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { signupUser } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store/store';

type UserTypeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'UserType'>;
type UserTypeScreenRouteProp = RouteProp<AuthStackParamList, 'UserType'>;

const UserTypeScreen = () => {
  const navigation = useNavigation<UserTypeScreenNavigationProp>();
  const route = useRoute<UserTypeScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  
  const [selectedUserType, setSelectedUserType] = useState<'patient' | 'therapist'>('patient');
  const { signupData } = route.params;

  const handleContinue = async () => {
    try {
      const completeSignupData = {
        ...signupData,
        userType: selectedUserType,
        confirmPassword: signupData.password, // Add confirmPassword for API
      };
      
      await dispatch(signupUser(completeSignupData)).unwrap();
      
      // Navigate to email verification
      navigation.navigate('EmailVerification', { email: signupData.email });
    } catch (error) {
      // Error is handled by Redux state and shown in snackbar
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Button
            mode="text"
            onPress={handleBack}
            icon="arrow-left"
            style={styles.backButton}
          >
            Back
          </Button>
        </View>

        <Surface style={styles.formContainer} elevation={2}>
          <Text variant="headlineMedium" style={styles.title}>
            I am a...
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Help us customize your experience
          </Text>

          <View style={styles.optionsContainer}>
            <Surface 
              style={[
                styles.optionCard,
                selectedUserType === 'patient' && styles.selectedCard
              ]} 
              elevation={selectedUserType === 'patient' ? 4 : 1}
            >
              <RadioButton.Item
                label=""
                value="patient"
                status={selectedUserType === 'patient' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedUserType('patient')}
                style={styles.radioItem}
              />
              <View style={styles.optionContent}>
                <Text variant="headlineSmall" style={styles.optionIcon}>🧘‍♀️</Text>
                <Text variant="titleMedium" style={styles.optionTitle}>
                  Someone seeking support
                </Text>
                <Text variant="bodyMedium" style={styles.optionDescription}>
                  I want to track my mood, journal, meditate, and connect with mental health professionals
                </Text>
              </View>
            </Surface>

            <Surface 
              style={[
                styles.optionCard,
                selectedUserType === 'therapist' && styles.selectedCard
              ]} 
              elevation={selectedUserType === 'therapist' ? 4 : 1}
            >
              <RadioButton.Item
                label=""
                value="therapist"
                status={selectedUserType === 'therapist' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedUserType('therapist')}
                style={styles.radioItem}
              />
              <View style={styles.optionContent}>
                <Text variant="headlineSmall" style={styles.optionIcon}>👨‍⚕️</Text>
                <Text variant="titleMedium" style={styles.optionTitle}>
                  Mental health professional
                </Text>
                <Text variant="bodyMedium" style={styles.optionDescription}>
                  I want to provide therapy sessions, manage patients, and offer professional support
                </Text>
              </View>
            </Surface>
          </View>

          <Button
            mode="contained"
            onPress={handleContinue}
            loading={isLoading}
            disabled={isLoading}
            style={styles.continueButton}
            contentStyle={styles.buttonContent}
          >
            {isLoading ? 'Creating Account...' : 'Continue'}
          </Button>
        </Surface>
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
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6B73FF',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6B73FF',
    backgroundColor: '#F8F9FF',
  },
  radioItem: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  optionContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  optionIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  optionTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1C1B1F',
  },
  optionDescription: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  continueButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default UserTypeScreen;