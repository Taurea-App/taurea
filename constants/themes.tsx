import { Theme } from "@react-navigation/native"
import Colors from "./Colors";

const DefaultTheme: Theme = {
    dark: false,
    colors: {
      primary: Colors.primary,
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(216, 216, 216)',
      notification: 'rgb(255, 59, 48)',
    },
  };

const DarkTheme: Theme = {
dark: true,
colors: {
    primary: Colors.primary,
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
},
};

export { DefaultTheme, DarkTheme }