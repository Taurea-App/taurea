import { Link } from "expo-router";
import {
  View,
  Pressable,
  Text,
  ColorSchemeName,
} from "react-native";

import Colors from "@/constants/Colors";
import { styles } from "./styles";

export default function EndMenu({
  setCurrentIndex,
  routineId,
  colorScheme,
}: {
  setCurrentIndex: (index: number) => void;
  routineId: string;
  colorScheme: ColorSchemeName;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: 20,
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
        Routine Completed!
      </Text>

      {/* Restart Button */}
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: Colors.primary,
          },
        ]}
        onPress={() => setCurrentIndex(-1)}
      >
        <Text style={styles.buttonText}>Restart</Text>
      </Pressable>

      {/* Go Back Button */}
      <Link href={`/routine/${routineId}`} asChild>
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: Colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  colorScheme === "light"
                    ? Colors.light.text
                    : Colors.dark.text,
              },
            ]}
          >
            Go Back
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
