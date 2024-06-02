import { router } from "expo-router";
import {
  View,
  Pressable,
  Text,
  ColorSchemeName,
  Dimensions,
} from "react-native";
import FastImage from "react-native-fast-image";

import { styles } from "./styles";

import Colors from "@/constants/Colors";

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
        height: Dimensions.get("window").height,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 200,
          // borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      >
        <FastImage
          source={require("@/assets/images/robot_dance_optimized.gif")}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>
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
      {/* <Link href={`/my-routines/${routineId}`} asChild> */}
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: Colors.primary,
          },
        ]}
        onPress={() => router.back()}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                colorScheme === "light" ? Colors.light.text : Colors.dark.text,
            },
          ]}
        >
          Go Back
        </Text>
      </Pressable>
      {/* </Link> */}
    </View>
  );
}
