const primary = "#fa8320";
const tintColorLight = primary;
const tintColorDark = primary;

export default {
  primary,
  red: "#FF5050",
  grey: "#A9A9A9",
  blue: "#88BBFF",
  yellow: "#FFFF88",
  gray: "#A9A9A9",
  light: {
    text: "#000",
    background: "#eee",
    border: "#d8d8d8",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    tabBackgroundColor: "#fff",
    popupBackground: "#f9f9f9",
    blue: "#88BBFF",
    yellow: "#FFFF88",
    primaryBackground: "#fcedcf",
    greyText: "#A9A9A9",
    highlightedTabBackgroundColor: primary,
  },
  dark: {
    text: "#fff",
    background: "#111721",
    border: "#272729",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    tabBackgroundColor: "#1e2533",
    popupBackground: "#111",
    blue: "#2288AA",
    yellow: "#FFAA22",
    primaryBackground: "#1e2533",
    greyText: "#A9A9A9",
    highlightedTabBackgroundColor: primary,
  },
};
