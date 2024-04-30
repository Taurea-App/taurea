import { View, Text } from "react-native";

import Colors from "@/constants/Colors";
import { Routine } from "@/types";

export default function FullRoutineView({
  currentIndex,
  routine,
}: {
  currentIndex: number;
  routine: Routine;
}) {
  return (
    <View
      style={{
        height: 400,
        width: "100%",
        // justifyContent: "center",
        alignItems: "center",
        // margin: 20,
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.primary,
          borderRadius: 20,
          // flexDirection: "row",
          // justifyContent: "space-between",
          width: "100%",
          flex: 1,
        }}
      >
        <Text
          style={{
            color: "grey",
          }}
        >
          {currentIndex + 1}/{routine?.routineItems.length}
        </Text>
      </View>
    </View>
  );
}
