import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import algoliasearch from "algoliasearch/lite";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { NativeBaseProvider } from "native-base";
import { useEffect } from "react";
import { InstantSearch } from "react-instantsearch-core";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { UserProvider } from "./context/userContext";

import { useColorScheme } from "@/components/useColorScheme";
import { DarkTheme, DefaultTheme } from "@/constants/themes";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
  // Initialize Algolia search client with environment variables.
  const appId = process.env.EXPO_PUBLIC_ALGOLIA_APP_ID as string;
  const apiKey = process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY as string;
  const searchClient = algoliasearch(appId, apiKey);
  console.log("appId", appId);
  console.log("apiKey", apiKey);
  console.log("searchClient", searchClient);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <UserProvider>
            <InstantSearch searchClient={searchClient} indexName="search_index">
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false, title: "Home" }}
                />
                <Stack.Screen
                  name="login"
                  options={{ title: "Login", headerShown: false }}
                />
              </Stack>
            </InstantSearch>
          </UserProvider>
        </ThemeProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
