import { View, Text, Dimensions, useColorScheme } from "react-native";

import RoutineList from "@/components/RoutineList";
import Colors from "@/constants/Colors";
import { ExerciseInRoutine, Routine } from "@/types";

export default function FullRoutineView({
  routine,
  currentExercise,
}: {
  routine: Routine;
  currentExercise: ExerciseInRoutine | null;
}) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        height: Dimensions.get("window").height - 100,
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
            color: Colors.light.text,
            fontSize: 16,
            padding: 10,
            textAlign: "center",
            height: 70,
          }}
        >
          {routine.name}
        </Text>
        <RoutineList
          routineItems={routine.routineItems}
          colorScheme={colorScheme}
          currentExercise={currentExercise}
        />
      </View>
    </View>
  );
}
