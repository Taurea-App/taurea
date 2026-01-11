import { Theme } from "@react-navigation/native";
import { Platform } from "react-native";

import Colors from "./Colors";

// React Navigation 7.x requires fonts configuration
const fonts = {
  regular: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    fontWeight: "400" as const,
  },
  medium: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
    fontWeight: "500" as const,
  },
  bold: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    fontWeight: "700" as const,
  },
  heavy: {
    fontFamily: Platform.select({ ios: "System", android: "sans-serif" }),
    fontWeight: "900" as const,
  },
};

const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: Colors.light.background,
    card: Colors.light.tabBackgroundColor,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.primary,
  },
  fonts,
};

const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.primary,
    background: Colors.dark.background,
    card: Colors.dark.tabBackgroundColor,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.primary,
  },
  fonts,
};

export { DefaultTheme, DarkTheme };
