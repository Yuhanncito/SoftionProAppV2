import { Tabs } from "expo-router";
import Icon from 'react-native-vector-icons/Ionicons'; // Para los iconos

export default function RootLayout() {
  return (


<Tabs
screenOptions={({ route }) => ({
  gestureEnabled: false,  // Deshabilitar gestos de retroceso
  headerShown: false,     // Ocultar encabezados si lo deseas
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'Hom') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === 'Notifications') {
      iconName = focused ? 'notifications' : 'notifications-outline';
    } else if (route.name === 'Profile') {
      iconName = focused ? 'person' : 'person-outline';
    }

    return <Icon name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: 'blue',
  tabBarInactiveTintColor: 'gray',
  headerShown: false, // Ocultar el header
})}
>
      <Tabs.Screen name="Hom" />
      <Tabs.Screen name="Notifications"  />
      <Tabs.Screen name="Profile" />
</Tabs>
  );
}
