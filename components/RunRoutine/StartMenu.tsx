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
import { useContext } from "react";
import { TranslationContext } from "@/app/context/translationProvider";

export default function StartMenu({
  routine,
  handleNext,
  colorScheme,
}: {
  routine: Routine | null;
  handleNext: () => void;
  colorScheme: ColorSchemeName;
}) {
  const { translate } = useContext(TranslationContext);
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
        <Text style={styles.buttonText}>{translate("general.start")}</Text>
      </Pressable>
    </View>
  );
}
