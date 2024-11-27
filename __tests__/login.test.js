import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Longinn } from '../app/index'; // Asegúrate de que la ruta sea correcta
import { Provider } from 'react-native-paper';
import { useRouter } from 'expo-router';

// Mock de useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock de Provider
jest.mock('react-native-paper', () => {
  const { View } = require('react-native');
  return {
    Provider: ({ children }) => <View>{children}</View>,
  };
});

// Mock de console.log para evitar errores
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Longinn Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <Provider>
        <Longinn />
      </Provider>
    );

    // Verificar textos visibles
    expect(getByText('Longinnn')).toBeTruthy();
    expect(getByText('Correo electrónicoc')).toBeTruthy();
    expect(getByText('Contraseñaa')).toBeTruthy();

    // Verificar elementos con testID
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });

  it('calls the button onPress handler', () => {
    const { getByTestId } = render(
      <Provider>
        <Longinn />
      </Provider>
    );

    const button = getByTestId('login-button');
    fireEvent.press(button);

    // Validar que console.log fue llamado
    expect(console.log).toHaveBeenCalledWith('Iniciar sesión');
  });
});
