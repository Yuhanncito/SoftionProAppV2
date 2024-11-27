import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
          router.push('/(home)/Hom'); // Redirigir al home si el token existe
        } else {
          router.push('/'); // Si no hay token, redirigir al login
        }
      } catch (error) {
        console.log('Error al verificar el token:', error);
        router.push('/'); // Manejo de errores
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  // Renderizar nada mientras se verifica el token
  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return token ? <StackPrivate /> : <StactPublic />;
}

const StactPublic = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          headerTitle: 'Registro',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen name="ForgotPassword" />
      <Stack.Screen name="VeryfyQuestion" />
      <Stack.Screen name="RestorePassword" />
    </Stack>
  );
};

const StackPrivate = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(home)/Hom" />
    </Stack>
  );
};
