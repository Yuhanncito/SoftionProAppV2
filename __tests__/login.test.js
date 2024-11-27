import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Longinn } from '../app/index'; // Asegúrate de que la ruta sea correcta
import { useRouter } from 'expo-router';
import { Provider } from 'react-native-paper';

// Mocks de dependencias
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock de `Provider` de react-native-paper para evitar errores
jest.mock('react-native-paper', () => {
  const { View, Text } = require('react-native');
  return {
    Provider: ({ children }) => <View>{children}</View>,
    Portal: ({ children }) => <View>{children}</View>,
    Modal: ({ visible, children }) => (visible ? <View>{children}</View> : null),
  };
});

describe('Longinn renderizado', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Configura el mock de useRouter para devolver push
    useRouter.mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  it('debería renderizar correctamente el componente de Longinn', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider>
        <Longinn />
      </Provider>
    );

    // Verificar que el título y campos se rendericen correctamente
    expect(getByText('Longinnn')).toBeTruthy();
    expect(getByText('Correo electrónicoc')).toBeTruthy();
    expect(getByText('Contraseñaa')).toBeTruthy();
    expect(getByText('Iniciar Sesiónn')).toBeTruthy();
    expect(getByPlaceholderText('Ingrese su correoo')).toBeTruthy();
    expect(getByPlaceholderText('Ingrese su contraseñaa')).toBeTruthy();
  });

  it('debería llamar a la función onPress del botón Iniciar Sesiónn', () => {
    const { getByText } = render(
      <Provider>
        <Longinn />
      </Provider>
    );

    // Mock de console.log
    const consoleLogSpy = jest.spyOn(console, 'log');

    const button = getByText('Iniciar Sesiónn');
    fireEvent.press(button);

    // Verificar que console.log fue llamado con 'Iniciar sesión'
    expect(consoleLogSpy).toHaveBeenCalledWith('Iniciar sesión');

    // Restaurar console.log después de la prueba
    consoleLogSpy.mockRestore();
  });
});
