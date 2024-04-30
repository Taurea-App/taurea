import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ColorSchemeName,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";

import Timer from "@/components/Timer";
import Colors from "@/constants/Colors";
import { Routine, ExerciseInRoutine } from "@/types";

export default function MainView({
  routine,
  handleNext,
  colorScheme,
  styles,
  currentExercise,
  currentSubroutineSet,
  currentIndex,
  waitingForSubroutineTimer,
  subroutineTime,
  handleSubroutineTimerEnd,
  setWaitingForTimer,
  handlePrevious,
  waitingForTimer,
}: {
  routine: Routine;
  handleNext: () => void;
  colorScheme: ColorSchemeName;
  styles: StyleSheet.NamedStyles<any>;
  currentExercise: ExerciseInRoutine | null;
  currentSubroutineSet: number;
  currentIndex: number;
  waitingForSubroutineTimer: boolean;
  subroutineTime: number;
  handleSubroutineTimerEnd: () => void;
  setWaitingForTimer: (value: boolean) => void;
  handlePrevious: () => void;
  waitingForTimer: boolean;
}) {
  return (
    <SafeAreaView
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        // gap: 20,
        // flex: 1,
        height: Dimensions.get("window").height - 50,
        // paddingBottom: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          // justifyContent: "space-between",
          // flex: 1,
        }}
      >
        {/* image in case it exists (url in image_url) */}
        {currentExercise?.image_url && (
          <View
            style={{
              width: "100%",
              height: 200,
              // borderRadius: 20,
              overflow: "hidden",
              backgroundColor: "grey",
            }}
          >
            <Image
              source={{ uri: currentExercise.image_url }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        )}

        {/*  */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                alignSelf: "flex-start",
                color:
                  colorScheme === "light"
                    ? Colors.light.text
                    : Colors.dark.text,
              },
            ]}
          >
            {currentExercise?.name}
          </Text>

          {/* Current set in case we are in a subroutine */}
          <View
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            {currentSubroutineSet !== -1 && (
              <Text
                style={[
                  styles.subtitle,
                  {
                    color:
                      colorScheme === "light"
                        ? Colors.light.text
                        : Colors.dark.text,
                  },
                ]}
              >
                Set {currentSubroutineSet + 1}{" "}
                {routine?.routineItems[currentIndex].unit === "Sets" &&
                  `of ${routine?.routineItems[currentIndex].quantity}`}
              </Text>
            )}

            {/* Subroutine Timer */}
            {waitingForSubroutineTimer && (
              <Timer
                initialMilliseconds={subroutineTime * 1000}
                callback={handleSubroutineTimerEnd}
                exerciseId={routine?.routineItems[currentIndex].id}
                smallSize
              />
            )}
          </View>

          {/* Description */}
          <Text
            style={[
              styles.description,
              {
                alignSelf: "flex-start",
                color:
                  colorScheme === "light"
                    ? Colors.light.text
                    : Colors.dark.text,
                height: 40,
              },
            ]}
          >
            {currentExercise?.description}
          </Text>

          {/* Quantity */}
          <Text
            style={[
              styles.quantity,
              {
                alignSelf: "flex-start",
                color: Colors.primary,
                height: 25,
              },
            ]}
          >
            {currentExercise?.quantity} {currentExercise?.unit}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 150,
        }}
      >
        {/* Timer */}
        {(currentExercise?.unit === "Mins." ||
          currentExercise?.unit === "Minutes" ||
          currentExercise?.unit === "Secs." ||
          currentExercise?.unit === "Seconds") && (
          <Timer
            initialMilliseconds={
              currentExercise?.unit === "Mins." ||
              currentExercise?.unit === "Minutes"
                ? currentExercise?.quantity * 60 * 1000
                : currentExercise?.quantity * 1000
            }
            callback={() => setWaitingForTimer(false)}
            exerciseId={currentExercise?.id}
          />
        )}
      </View>

      {/* Next and Previous Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 40,
        }}
      >
        <Pressable
          onPress={handlePrevious}
          style={[
            styles.nextButton,
            {
              backgroundColor: Colors.primary,
              shadowOpacity: 0.25,
            },
          ]}
        >
          {/* Prev icon */}
          <Ionicons name="chevron-back" size={40} color="white" />
        </Pressable>

        <Pressable
          onPress={handleNext}
          style={[
            styles.nextButton,
            {
              backgroundColor: waitingForTimer ? Colors.grey : Colors.primary,
              shadowOpacity: waitingForTimer ? 0 : 0.25,
            },
          ]}
          disabled={waitingForTimer}
        >
          <Ionicons name="chevron-forward" size={40} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
