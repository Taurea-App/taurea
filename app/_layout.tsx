import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import { Container, NativeBaseProvider } from 'native-base';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, DefaultTheme } from '@/constants/themes';

import { useColorScheme } from '@/components/useColorScheme';
import { useGlobalSearchParams } from 'expo-router';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebaseConfig';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export const UserContext = createContext<User | null>(null);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />; 
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
      console.log('User state changed:', authUser);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <UserContext.Provider value={user}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
              <Stack.Screen name="login" options={{ title: 'Login' }} />
            </Stack>
          </UserContext.Provider>
        </ThemeProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
