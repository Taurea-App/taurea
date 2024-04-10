import { Link, Stack, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";

import Timer from "@/components/Timer";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { ExerciseInRoutine, Routine, RoutineItem, Subroutine } from "@/types";

export default function Page() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentExercise, setCurrentExercise] =
    useState<ExerciseInRoutine | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  // The index of the current exercise in the current subroutine
  const [currentSubroutineIndex, setCurrentSubroutineIndex] =
    useState<number>(-1);
  // The set of the subroutine that is currently being executed
  const [currentSubroutineSet, setCurrentSubroutineSet] = useState<number>(-1);

  const [waitingForTimer, setWaitingForTimer] = useState<boolean>(false);

  const [waitingForSubroutineTimer, setWaitingForSubroutineTimer] =
    useState<boolean>(false);
  const [subroutineTime, setSubroutineTime] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const auth = FIREBASE_AUTH;

  const colorScheme = useColorScheme();

  // function to determine if the current exercise is a subroutine or an exercise
  const isSubroutine = (item: RoutineItem) => {
    if (!item) {
      return false;
    }
    return (
      (item as any).exerciseId === "new_subroutine" || !(item as any).exerciseId
    );
  };

  // Fetch routine from API
  useEffect(() => {
    const fetchRoutine = async () => {
      // Fetch the routine details
      const routineRef = doc(
        FIRESTORE_DB,
        "users/" + auth.currentUser?.uid + "/routines",
        routineId,
      );
      const routineSnap = await getDoc(routineRef);

      if (routineSnap.exists()) {
        setRoutine({
          id: routineSnap.id,
          ...routineSnap.data(),
        } as Routine);
        setLoading(false);
      }
    };
    fetchRoutine();
  }, [routineId]);

  useEffect(() => {
    if (routine && currentIndex !== -1) {
      // If the current item is a subroutine
      if (isSubroutine(routine.routineItems[currentIndex])) {
        const tempCurrentSubroutine = routine.routineItems[
          currentIndex
        ] as Subroutine;
        console.log("Starting subroutine", tempCurrentSubroutine);
        setCurrentSubroutineIndex(0); // Start the subroutine from the first exercise
        setCurrentSubroutineSet(0); // Start the subroutine from the first set
        setCurrentExercise(tempCurrentSubroutine.exercises[0]);
        if (
          (["Secs.", "Mins.", "Seconds", "Minutes"] as const).includes(
            tempCurrentSubroutine.unit as any,
          )
        ) {
          setWaitingForSubroutineTimer(true);
          setSubroutineTime(
            (tempCurrentSubroutine.unit === "Mins." ||
            tempCurrentSubroutine.unit === "Minutes"
              ? tempCurrentSubroutine.quantity * 60
              : tempCurrentSubroutine.quantity) as number,
          );
        }
        // If the current item is an exercise
      } else {
        const tempCurrentExercise = routine.routineItems[
          currentIndex
        ] as ExerciseInRoutine;
        setCurrentSubroutineIndex(-1); // Reset the subroutine index
        setCurrentSubroutineSet(-1); // Reset the subroutine set
        setCurrentExercise(tempCurrentExercise);
      }
    }
  }, [routine, currentIndex]);

  useEffect(() => {
    if (
      currentExercise &&
      (["Secs.", "Mins.", "Seconds", "Minutes"] as const).includes(
        currentExercise.unit as any,
      )
    ) {
      setWaitingForTimer(true);
    } else {
      setWaitingForTimer(false);
    }
  }, [currentExercise]);

  const handleNext = () => {
    if (waitingForTimer) {
      return;
    }

    if (!routine) {
      return;
    }

    // If the current item is a subroutine
    if (
      routine?.routineItems &&
      isSubroutine(routine.routineItems[currentIndex])
    ) {
      const currentSubroutine = routine?.routineItems[
        currentIndex
      ] as Subroutine;
      if (
        currentSubroutine.unit === "Sets" &&
        currentSubroutineIndex === currentSubroutine.exercises.length - 1 &&
        currentSubroutineSet === currentSubroutine.quantity - 1
      ) {
        setCurrentIndex(currentIndex + 1);
      } else if (
        currentSubroutineIndex ===
        currentSubroutine.exercises.length - 1
      ) {
        setCurrentSubroutineIndex(0);
        setCurrentSubroutineSet(currentSubroutineSet + 1);
        setCurrentExercise(currentSubroutine.exercises[0]);
      } else {
        setCurrentSubroutineIndex(currentSubroutineIndex + 1);
        setCurrentExercise(
          currentSubroutine.exercises[currentSubroutineIndex + 1],
        );
      }
      // If the current item is an exercise
    } else {
      if (currentIndex === routine.routineItems.length) {
        setCurrentIndex(-1);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handleSubroutineTimerEnd = () => {
    setWaitingForSubroutineTimer(false);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <Stack.Screen
        options={{
          title: "",
          headerBackTitleVisible: false,
          headerTransparent: true,
        }}
      />

      {loading && (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme === "dark" ? "dark" : "light"].tint}
          />
        </View>
      )}
      {!loading && (
        <View
          style={
            {
              // flex: 1,
            }
          }
        >
          {/* Start Menu */}
          {currentIndex === -1 && (
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
                      colorScheme === "light"
                        ? Colors.light.text
                        : Colors.dark.text,
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
          )}

          {/* Exercise */}
          {routine &&
            currentIndex !== -1 &&
            currentIndex < routine.routineItems.length && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                {/*  */}
                <View
                  style={{
                    gap: 10 ,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
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
                </View>

                {/* Next Button */}
                <Pressable
                  onPress={handleNext}
                  style={[
                    styles.button,
                    {
                      backgroundColor: waitingForTimer
                        ? Colors.grey
                        : Colors.primary,
                      shadowOpacity: waitingForTimer ? 0 : 0.25,
                    },
                  ]}
                  disabled={waitingForTimer}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </Pressable>
              </View>
            )}

          {/* End Menu */}
          {routine && currentIndex === routine.routineItems.length && (
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
                      colorScheme === "light"
                        ? Colors.light.text
                        : Colors.dark.text,
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
                  <Text style={styles.buttonText}>Go Back</Text>
                </Pressable>
              </Link>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    padding: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 24,
  },
  button: {
    color: "white",
    padding: 10,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
  },
  quantity: {
    fontSize: 20,
  },
});
