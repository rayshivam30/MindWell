import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from '../../store/store';
import { theme } from '../../theme/theme';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

const MockedNavigator = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </PaperProvider>
    </PersistGate>
  </Provider>
);

describe('WelcomeScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <MockedNavigator>
        <WelcomeScreen />
      </MockedNavigator>
    );

    expect(getByText('MindWell')).toBeTruthy();
    expect(getByText('Your mental health companion')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Create Account')).toBeTruthy();
    expect(getByText('Continue as Guest')).toBeTruthy();
  });

  it('displays the app logo and branding', () => {
    const { getByText } = render(
      <MockedNavigator>
        <WelcomeScreen />
      </MockedNavigator>
    );

    expect(getByText('🧠')).toBeTruthy();
    expect(getByText('MindWell')).toBeTruthy();
  });

  it('shows terms and privacy policy text', () => {
    const { getByText } = render(
      <MockedNavigator>
        <WelcomeScreen />
      </MockedNavigator>
    );

    expect(getByText(/Terms of Service and Privacy Policy/)).toBeTruthy();
  });

  it('handles login button press', () => {
    const { getByText } = render(
      <MockedNavigator>
        <WelcomeScreen />
      </MockedNavigator>
    );

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);
    // Navigation mock will handle the actual navigation
  });

  it('handles create account button press', () => {
    const { getByText } = render(
      <MockedNavigator>
        <WelcomeScreen />
      </MockedNavigator>
    );

    const signupButton = getByText('Create Account');
    fireEvent.press(signupButton);
  });

  it('handles continue as guest button press', () => {
    const { getByText } = render(
      <MockedNavigator>
        <WelcomeScreen />
      </MockedNavigator>
    );

    const guestButton = getByText('Continue as Guest');
    fireEvent.press(guestButton);
  });
});