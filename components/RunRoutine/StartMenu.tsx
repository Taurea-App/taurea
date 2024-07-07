import {
  View,
  Text,
  Pressable,
  ColorSchemeName,
  Dimensions,
} from "react-native";

import { styles } from "./styles";

import Colors from "@/constants/Colors";
import { Routine } from "@/types";

export default function StartMenu({
  routine,
  handleNext,
  colorScheme,
}: {
  routine: Routine | null;
  handleNext: () => void;
  colorScheme: ColorSchemeName;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: 20,
        flex: 1,
        height: Dimensions.get("window").height,
      }}
    >
      <Text
        style={[
          styles.title,
          {
            color:
              colorScheme === "light" ? Colors.light.text : Colors.dark.text,
          },
        ]}
      >
        {routine?.name}
      </Text>

      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: Colors.primary,
          },
        ]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>
    </View>
  );
}
