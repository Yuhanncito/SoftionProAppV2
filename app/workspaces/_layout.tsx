import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function WorkspacesLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="[workspaceId]">
        <Stack.Screen name="[workspaceId]" />
        <Stack.Screen name="ProjectDetails" />
        <Stack.Screen name="BoardView" />
        <Stack.Screen name="detailsproject" />
        <Stack.Screen name="detailsWorkspace" />
        <Stack.Screen name="detailsTask" />
        <Stack.Screen name="PaymentModal" />
        <Stack.Screen name="UpgradePlanModal" />
        <Stack.Screen name="createTask" />
      </Stack>
    </GestureHandlerRootView>
  );
}
