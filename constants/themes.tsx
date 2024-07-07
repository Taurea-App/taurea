import { Theme } from "@react-navigation/native";

import Colors from "./Colors";

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
};

export { DefaultTheme, DarkTheme };
