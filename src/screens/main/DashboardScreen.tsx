import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Surface, Card, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';

const DashboardScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const quickActions = [
    { title: 'Mood Check-in', icon: '😊', description: 'How are you feeling today?' },
    { title: 'Journal Entry', icon: '📝', description: 'Write your thoughts' },
    { title: 'Meditation', icon: '🧘‍♀️', description: 'Find your calm' },
    { title: 'AI Chat', icon: '🤖', description: 'Talk to your AI companion' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={48} 
              label={user?.name?.charAt(0) || 'U'} 
              style={styles.avatar}
            />
            <View>
              <Text variant="headlineSmall" style={styles.greeting}>
                Hello, {user?.name?.split(' ')[0] || 'User'}!
              </Text>
              <Text variant="bodyMedium" style={styles.subGreeting}>
                Welcome to your wellness journey
              </Text>
            </View>
          </View>
          <Button
            mode="text"
            onPress={handleLogout}
            icon="logout"
            compact
          >
            Logout
          </Button>
        </View>

        {/* Daily Check-in Card */}
        <Surface style={styles.checkInCard} elevation={2}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Daily Check-in
          </Text>
          <Text variant="bodyMedium" style={styles.cardSubtitle}>
            How are you feeling today?
          </Text>
          <View style={styles.moodSelector}>
            {['😢', '😕', '😐', '🙂', '😊'].map((emoji, index) => (
              <Button
                key={index}
                mode="outlined"
                onPress={() => console.log('Mood selected:', emoji)}
                style={styles.moodButton}
              >
                {emoji}
              </Button>
            ))}
          </View>
        </Surface>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Card
                key={index}
                style={styles.actionCard}
                onPress={() => console.log('Action pressed:', action.title)}
              >
                <Card.Content style={styles.actionContent}>
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text variant="titleMedium" style={styles.actionTitle}>
                    {action.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.actionDescription}>
                    {action.description}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Today's Summary */}
        <Surface style={styles.summaryCard} elevation={2}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Today's Summary
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.stat}>
              <Text variant="headlineMedium" style={styles.statValue}>0</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Mood entries</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headlineMedium" style={styles.statValue}>0</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Journal entries</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headlineMedium" style={styles.statValue}>0</Text>
              <Text variant="bodySmall" style={styles.statLabel}>Minutes meditated</Text>
            </View>
          </View>
        </Surface>

        {/* User Type Specific Content */}
        {user?.userType === 'therapist' && (
          <Surface style={styles.therapistCard} elevation={2}>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Therapist Dashboard
            </Text>
            <Text variant="bodyMedium" style={styles.cardSubtitle}>
              Manage your practice and patients
            </Text>
            <View style={styles.therapistActions}>
              <Button mode="contained" style={styles.therapistButton}>
                View Patients
              </Button>
              <Button mode="outlined" style={styles.therapistButton}>
                Schedule
              </Button>
            </View>
          </Surface>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#6B73FF',
  },
  greeting: {
    fontWeight: 'bold',
    color: '#1C1B1F',
  },
  subGreeting: {
    color: '#666',
  },
  checkInCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#1C1B1F',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    borderRadius: 12,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1C1B1F',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    textAlign: 'center',
    color: '#666',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#6B73FF',
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  therapistCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  therapistActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  therapistButton: {
    flex: 1,
    borderRadius: 12,
  },
});

export default DashboardScreen;