// app/_layout.tsx
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { ThemeProvider } from '../context/ThemeContext';
import { useRouter } from "expo-router";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenWelcome');
      if (!hasSeenOnboarding) {
        router.replace('/OnboardingScreen');
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="OnboardingScreen" options={{ title: "Onboarding Screen" }} />
        <Stack.Screen name="Settings" options={{ title: "Settings" }} />
        <Stack.Screen name="ProfileEditScreens" options={{ title: "Profile Edit Screen" }} />
        <Stack.Screen name="index" options={{ title: "Home Screen" }} />
        <Stack.Screen name="DoDont" options={{ title: "Do's and Don'ts" }} />
        <Stack.Screen name="DoList" options={{ title: "Do List" }} />
        <Stack.Screen name="DontList" options={{ title: "Don't List" }} />
        <Stack.Screen name="goal" options={{ title: "Goal" }} />
        <Stack.Screen name="journal" options={{ title: "Journal" }} />
        <Stack.Screen name="HabitTracker" options={{ title: "Habit Tracker" }} />
        <Stack.Screen name="log" options={{ title: "Log" }} />
      </Stack>
    </ThemeProvider>
  );
}
