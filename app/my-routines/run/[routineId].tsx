import { Stack, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
  Dimensions,
} from "react-native";

import EndMenu from "./EndMenu";
import MainView from "./MainView";
import StartMenu from "./StartMenu";
import { styles } from "./styles";

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

  // Set the current exercise when the current index changes
  useEffect(() => {
    if (routine && currentIndex !== -1) {
      // If the current item is a subroutine
      if (isSubroutine(routine.routineItems[currentIndex])) {
        const tempCurrentSubroutine = routine.routineItems[
          currentIndex
        ] as Subroutine;
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

  // Set the waiting for timer state when the current exercise changes
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

  // Function to handle the next button press
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

  // Function to handle the previous button press
  const handlePrevious = () => {
    if (currentIndex === -1 || !routine) {
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
      if (currentSubroutineIndex === 0 && currentSubroutineSet === 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (currentSubroutineIndex === 0) {
        setCurrentSubroutineIndex(currentSubroutine.exercises.length - 1);
        setCurrentSubroutineSet(currentSubroutineSet - 1);
        setCurrentExercise(
          currentSubroutine.exercises[currentSubroutine.exercises.length - 1],
        );
      } else {
        setCurrentSubroutineIndex(currentSubroutineIndex - 1);
        setCurrentExercise(
          currentSubroutine.exercises[currentSubroutineIndex - 1],
        );
      }
      // If the current item is an exercise
    } else {
      if (currentIndex === 0) {
        setCurrentIndex(-1);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleSubroutineTimerEnd = () => {
    setWaitingForSubroutineTimer(false);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <ScrollView
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
          // title: "",
          // headerBackTitleVisible: false,
          // headerTransparent: true,
          // headerBackVisible: false,
          headerShown: false,
        }}
      />

      {loading && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: Dimensions.get("window").height,
          }}
        >
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme === "dark" ? "dark" : "light"].tint}
          />
        </View>
      )}

      {!loading && (
        <View
          style={{
            flex: 1,
          }}
        >
          {/* Start Menu */}
          {currentIndex === -1 && (
            <StartMenu
              routine={routine}
              handleNext={handleNext}
              colorScheme={colorScheme}
            />
          )}

          {/* Main View */}
          {routine &&
            currentIndex !== -1 &&
            currentIndex < routine.routineItems.length && (
              <MainView
                routine={routine}
                handleNext={handleNext}
                colorScheme={colorScheme}
                currentExercise={currentExercise}
                currentSubroutineSet={currentSubroutineSet}
                currentSubroutineIndex={currentSubroutineIndex}
                currentIndex={currentIndex}
                waitingForSubroutineTimer={waitingForSubroutineTimer}
                subroutineTime={subroutineTime}
                handleSubroutineTimerEnd={handleSubroutineTimerEnd}
                setWaitingForTimer={setWaitingForTimer}
                handlePrevious={handlePrevious}
                waitingForTimer={waitingForTimer}
              />
            )}

          {/* End Menu */}
          {routine && currentIndex === routine.routineItems.length && (
            <EndMenu
              routineId={routineId}
              setCurrentIndex={setCurrentIndex}
              colorScheme={colorScheme}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}
