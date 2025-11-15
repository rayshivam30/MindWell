import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from '../../store/store';
import { theme } from '../../theme/theme';
import LoginScreen from '../../screens/auth/LoginScreen';

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

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <MockedNavigator>
        <LoginScreen />
      </MockedNavigator>
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue your wellness journey')).toBeTruthy();
    expect(getByLabelText('Email')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { getByText, getByLabelText } = render(
      <MockedNavigator>
        <LoginScreen />
      </MockedNavigator>
    );

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const { getByText, getByLabelText } = render(
      <MockedNavigator>
        <LoginScreen />
      </MockedNavigator>
    );

    const emailInput = getByLabelText('Email');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Invalid email format')).toBeTruthy();
    });
  });

  it('shows validation error for short password', async () => {
    const { getByText, getByLabelText } = render(
      <MockedNavigator>
        <LoginScreen />
      </MockedNavigator>
    );

    const passwordInput = getByLabelText('Password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('toggles password visibility', () => {
    const { getByLabelText } = render(
      <MockedNavigator>
        <LoginScreen />
      </MockedNavigator>
    );

    const passwordInput = getByLabelText('Password');
    const toggleButton = getByLabelText('toggle password visibility');

    // Initially password should be hidden
    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleButton);

    // After toggle, password should be visible
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it('navigates to forgot password screen', () => {
    const { getByText } = render(
      <MockedNavigator>
        <LoginScreen />
      </MockedNavigator>
    );

    const forgotPasswordButton = getByText('Forgot Password?');
    fireEvent.press(forgotPasswordButton);
  });

  it('navigates to signup screen', () => {
    const { getByText } = render(
      <MockedNavigator>
        <LoginScreen />
      </MockedNavigator>
    );

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);
  });

  it('handles valid form submission', async () => {
    const { getByText, getByLabelText } = render(
      <MockedNavigator>
        <LoginScreen />
      </MockedNavigator>
    );

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    // Should not show validation errors
    await waitFor(() => {
      expect(() => getByText('Email is required')).toThrow();
      expect(() => getByText('Password is required')).toThrow();
    });
  });
});