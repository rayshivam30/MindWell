import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Surface, TextInput, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { AuthStackParamList } from '../../navigation/AppNavigator';
import { RootState } from '../../store/store';

type ProfileCustomizationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ProfileCustomization'>;

const mentalHealthConcerns = [
  'Anxiety', 'Depression', 'Stress', 'Sleep Issues', 'Relationship Issues',
  'Work Stress', 'Self-Esteem', 'Grief', 'Trauma', 'Addiction',
  'Eating Disorders', 'Bipolar Disorder', 'ADHD', 'OCD'
];

const ProfileCustomizationScreen = () => {
  const navigation = useNavigation<ProfileCustomizationScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [emergencyContact, setEmergencyContact] = useState('');

  const handleConcernToggle = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  const handleComplete = () => {
    // TODO: Save profile data to backend
    const profileData = {
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      mentalHealthConcerns: selectedConcerns,
      emergencyContact: emergencyContact || undefined,
    };
    
    console.log('Profile data:', profileData);
    
    // Navigation will be handled by AppNavigator since user is now verified
    // The app will automatically show the Dashboard
  };

  const handleSkip = () => {
    // Skip profile customization and go to main app
    // Navigation will be handled by AppNavigator
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.formContainer} elevation={2}>
          <Text variant="headlineMedium" style={styles.title}>
            Customize Your Profile
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Help us personalize your experience (optional)
          </Text>

          <View style={styles.form}>
            <View style={styles.row}>
              <TextInput
                label="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="Gender"
                value={gender}
                onChangeText={setGender}
                style={[styles.input, styles.halfInput]}
              />
            </View>

            <TextInput
              label="Emergency Contact (Phone)"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <View style={styles.concernsSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Areas you'd like support with:
              </Text>
              <View style={styles.chipsContainer}>
                {mentalHealthConcerns.map((concern) => (
                  <Chip
                    key={concern}
                    selected={selectedConcerns.includes(concern)}
                    onPress={() => handleConcernToggle(concern)}
                    style={[
                      styles.chip,
                      selectedConcerns.includes(concern) && styles.selectedChip
                    ]}
                    textStyle={[
                      styles.chipText,
                      selectedConcerns.includes(concern) && styles.selectedChipText
                    ]}
                  >
                    {concern}
                  </Chip>
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleComplete}
                style={styles.completeButton}
                contentStyle={styles.buttonContent}
              >
                Complete Setup
              </Button>
              
              <Button
                mode="text"
                onPress={handleSkip}
                style={styles.skipButton}
              >
                Skip for now
              </Button>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
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
  form: {
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  input: {
    backgroundColor: '#F8F9FF',
  },
  halfInput: {
    flex: 1,
  },
  concernsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1C1B1F',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F0F0F0',
  },
  selectedChip: {
    backgroundColor: '#6B73FF',
  },
  chipText: {
    color: '#666',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    gap: 16,
    marginTop: 16,
  },
  completeButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  skipButton: {
    alignSelf: 'center',
  },
});

export default ProfileCustomizationScreen;