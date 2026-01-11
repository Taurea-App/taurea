import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import {
  View,
  Text,
  Pressable,
  ColorSchemeName,
  SafeAreaView,
  Dimensions,
} from "react-native";
import FastImage from "react-native-fast-image";

import FullRoutineView from "./FullRoutineView";
import { styles } from "./styles";

import { TranslationContext } from "@/app/context/translationProvider";
import Timer from "@/components/Timer";
import Colors from "@/constants/Colors";
import { Routine, ExerciseInRoutine } from "@/types";
import { getDescription, getName } from "@/utils/exercises";

const BASE_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/gravitygrit-5768a.appspot.com/o/exercises%2F";

export default function MainView({
  routine,
  handleNext,
  colorScheme,
  currentExercise,
  currentSubroutineSet,
  currentSubroutineIndex,
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
  currentExercise: ExerciseInRoutine | null;
  currentSubroutineSet: number;
  currentSubroutineIndex: number;
  currentIndex: number;
  waitingForSubroutineTimer: boolean;
  subroutineTime: number;
  handleSubroutineTimerEnd: () => void;
  setWaitingForTimer: (value: boolean) => void;
  handlePrevious: () => void;
  waitingForTimer: boolean;
}) {
  const { language } = useContext(TranslationContext);
  return (
    <View>
      <SafeAreaView
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          height: Dimensions.get("window").height - 70, // 70 is the height of the bottom bar
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* image in case it exists (url in image_url) */}
          {currentExercise && (
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
                source={{
                  uri:
                    BASE_IMAGE_URL +
                    currentExercise.exerciseId +
                    ".gif?alt=media",
                }}
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
              {currentExercise ? getName(currentExercise, language) : ""}
            </Text>

            {/* Current set in case we are in a subroutine */}
            <View
              style={{
                // height: 40,
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "flex-start",
                marginTop: 20,
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
                  // height: 40,
                },
              ]}
            >
              {currentExercise ? getDescription(currentExercise, language) : ""}
            </Text>

            {/* Quantity */}
            <Text
              style={[
                styles.quantity,
                {
                  alignSelf: "flex-start",
                  color: Colors.primary,
                  // height: 25,
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
            // height: 150,
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
      <FullRoutineView routine={routine} currentExercise={currentExercise} />
    </View>
  );
}
