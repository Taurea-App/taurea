import { Ionicons } from "@expo/vector-icons";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Stack, useNavigation } from "expo-router";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  useColorScheme,
  Animated,
} from "react-native";
import Collapsible from "react-native-collapsible";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ExerciseInRoutineModal from "./ExerciseInRoutineModal";
import { editRoutineLayoutStyle as style } from "./edit_routine_layout_style";

import ExerciseSelectModal from "@/components/ExerciseSelectmodal";
import UnitSelectModal from "@/components/UnitSelectModal";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { Exercise, ExerciseInRoutine, RoutineItem, Subroutine } from "@/types";
import { idGen } from "@/utils/idGen";

const meassurementUnits = ["Reps.", "Secs.", "Mins.", "Meters", "Km"];

export default function EditRoutineLayout({
  isNewRoutine,
  routineId,
}: {
  isNewRoutine: boolean;
  routineId?: string;
}) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");

  const [exercises, setExercises] = useState<RoutineItem[]>([]);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [selectedUnit, setSelectedUnit] = useState(meassurementUnits[0]);

  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [showExerciseSelectModal, setShowExerciseSelectModal] = useState(false);
  const [showUnitSelectModal, setShowUnitSelectModal] = useState(false);

  const [loading, setLoading] = useState(!isNewRoutine);

  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] =
    useState<ExerciseInRoutine | null>(null);

  const [collapsedSubroutines, setCollapsedSubroutines] = useState<
    Map<string, boolean>
  >(new Map());

  const auth = FIREBASE_AUTH;

  const swipeableRefs = new Map();

  function isExerciseInRoutine(
    item: ExerciseInRoutine | Subroutine,
  ): item is ExerciseInRoutine {
    return (item as ExerciseInRoutine).exerciseId !== undefined;
  }

  useEffect(() => {
    if (!exercises) return;

    exercises.forEach((item) => {
      if (!(item as Subroutine).exercises) return;

      setCollapsedSubroutines((prevState) => {
        const newState = new Map(prevState);
        newState.set(item.id, true);
        return newState;
      });
    });
  }, [exercises]);

  const loadRoutine = async () => {
    if (!routineId) return;
    const routineRef = doc(
      FIRESTORE_DB,
      "users/" + auth.currentUser?.uid + "/routines",
      routineId,
    );
    const routineSnap = await getDoc(routineRef);
    if (routineSnap.exists()) {
      setRoutineName(routineSnap.data().name);
      setRoutineDescription(routineSnap.data().description);
      setExercises(routineSnap.data().exercises);
      setLoading(false);
    } else {
      console.log("No such document!");
    }
  };

  const saveRoutine = async () => {
    setLoading(true);
    const routine = {
      name: routineName,
      description: routineDescription,
      exercises,
    };
    if (isNewRoutine) {
      await addDoc(
        collection(
          FIRESTORE_DB,
          "users/" + auth.currentUser?.uid + "/routines",
        ),
        routine,
      );
    } else {
      if (!routineId) return;
      const routineRef = doc(
        FIRESTORE_DB,
        "users/" + auth.currentUser?.uid + "/routines",
        routineId,
      );
      await setDoc(routineRef, routine);
    }
    navigation.navigate("index");
  };

  const saveEditedExercise = () => {
    if (!exerciseToEdit) return;
    console.log("Saving edited exercise", exerciseToEdit);
    console.log("Exercises", exercises);

    setExercises(
      exercises.map((exercise) => ( isExerciseInRoutine(exercise) && exercise.id === exerciseToEdit.id ) ?
        exerciseToEdit : 
        exercise,
      ),
    );
    setShowEditExerciseModal(false);
  };

  const deleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== exerciseId));
  };

  const duplicateExercise = (exerciseId: string) => {
    const exercise = exercises.find((exercise) => exercise.id === exerciseId);
    if (!exercise || !isExerciseInRoutine(exercise)) return;
    const newExercise = {
      id: idGen(),
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      quantity: exercise.quantity,
      unit: exercise.unit,
    } as ExerciseInRoutine;
    setExercises([...exercises, newExercise]);
  };

  useEffect(() => {
    if (!isNewRoutine) {
      loadRoutine();
    }
  }, []);

  const renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={style.leftAction}>
        <Animated.Text
          style={[
            style.leftActionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <Ionicons name="trash" size={24} color="white" />
        </Animated.Text>
      </RectButton>
    );
  };

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [-1, 0, 0, 20],
    });
    return (
      <RectButton style={style.rightAction}>
        <Animated.Text
          style={[
            style.rightActionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <Ionicons name="copy" size={24} color="white" />
        </Animated.Text>
      </RectButton>
    );
  };

  const closeSwipeable = (exerciseId: string) => {
    const swipeable = swipeableRefs.get(exerciseId);
    if (swipeable) {
      swipeable.close();
    }
  };

  const renderRoutineItem = ({
    item,
    drag,
    isActive,
  }: {
    item: RoutineItem;
    drag: any;
    isActive: boolean;
  }) => {
    return (
      <Swipeable
        ref={(ref) => {
          if (ref) {
            swipeableRefs.set(item.id, ref);
          }
        }}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            deleteExercise(item.id);
          } else {
            duplicateExercise(item.id);
          }
          // Close the swipeable
          closeSwipeable(item.id);
        }}
      >
        <ScaleDecorator>
          {isExerciseInRoutine(item) ? (
            <TouchableOpacity
              style={[
                style.exerciseListItem,
                {
                  backgroundColor:
                    Colors[colorScheme ? colorScheme : "light"]
                      .tabBackgroundColor,
                },
              ]}
              onLongPress={drag}
              disabled={isActive}
              onPress={() => {
                if (!isExerciseInRoutine(item)) return;
                setShowEditExerciseModal(true);
                setExerciseToEdit(item);
              }}
            >
              <Text
                style={[
                  style.exerciseListItemName,
                  {
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  style.exerciseListItemQuantity,
                  {
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
              >
                {item.quantity} {item.unit}
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                backgroundColor:
                  Colors[colorScheme ? colorScheme : "light"]
                    .tabBackgroundColor,
                borderRadius: 10,
            }}>
              <TouchableOpacity
                style={[
                  style.subroutineListItem,
                  {
                    backgroundColor:
                      Colors[colorScheme ? colorScheme : "light"]
                        .tabBackgroundColor,
                  },
                ]}
                onLongPress={drag}
                disabled={isActive}
                onPress={() => {
                  setCollapsedSubroutines((prevState) => {
                    const newState = new Map(prevState);
                    newState.set(item.id, !newState.get(item.id));
                    return newState;
                  });
                }}
              >
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color={colorScheme ? Colors[colorScheme].text : Colors.light.text}
                />

                <Text
                  style={[
                    style.subroutineName,
                    {
                      color: colorScheme
                        ? Colors[colorScheme].text
                        : Colors.light.text,
                    },
                  ]}
                >
                  Subroutine
                </Text>
                
                <Text style={{ color: colorScheme ? Colors[colorScheme].text : Colors.light.text }}>
                  {item.quantity} {item.unit}
                </Text>

              </TouchableOpacity>

              <Collapsible
                collapsed={collapsedSubroutines.get(item.id)}
                align="center"
              >
                <View style={{ marginLeft: 20 }}>
                  {item.exercises.map((exercise) => (
                    <TouchableOpacity
                      style={[
                        style.exerciseListItem,
                        {
                          backgroundColor:
                            Colors[colorScheme ? colorScheme : "light"]
                              .tabBackgroundColor,
                        },
                      ]}
                      onLongPress={drag}
                      disabled={isActive}
                      onPress={() => {
                        setShowEditExerciseModal(true);
                        setExerciseToEdit(exercise);
                      }}
                    >
                      <Text
                        style={[
                          style.exerciseListItemName,
                          {
                            color: colorScheme
                              ? Colors[colorScheme].text
                              : Colors.light.text,
                          },
                        ]}
                      >
                        {exercise.name}
                      </Text>
                      <Text
                        style={[
                          style.exerciseListItemQuantity,
                          {
                            color: colorScheme
                              ? Colors[colorScheme].text
                              : Colors.light.text,
                          },
                        ]}
                      >
                        {exercise.quantity} {exercise.unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                

              </Collapsible>
            </View>
          )}

        </ScaleDecorator>
      </Swipeable>
    );
  };

  const SaveButton = () => {
    return (
      <TouchableOpacity
        style={style.saveButton}
        onPress={() => {
          saveRoutine();
        }}
      >
        <Text>Save</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        style.container,
        {
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        },
      ]}
    >
      <Stack.Screen
        options={{ title: isNewRoutine ? "New Routine" : "Edit Routine" }}
      />

      {loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme ? colorScheme : "light"].tint}
          />
        </View>
      )}

      {!loading && (
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Title and Description */}
          <View style={{ width: "100%", padding: 10 }}>
            <TextInput
              style={[
                style.title,
                {
                  color: colorScheme
                    ? Colors[colorScheme].text
                    : Colors.light.text,
                },
              ]}
              onChangeText={setRoutineName}
              value={routineName}
              placeholder="Routine Name"
            />
            <TextInput
              style={style.description}
              onChangeText={setRoutineDescription}
              value={routineDescription}
              placeholder="Routine Description"
              blurOnSubmit
              multiline
            />
          </View>

          {/* Exercise List */}
          <DraggableFlatList
            style={style.exerciseList}
            data={exercises}
            containerStyle={{ flex: 1 }}
            onDragEnd={({ data }) => setExercises(data)}
            renderItem={({ item, drag, isActive }) =>
              renderRoutineItem({ item, drag, isActive })
            }
            keyExtractor={(item, index) => index.toString() + item.id}
          />

          <View style={style.newExerciseForm}>
            <View
              style={[
                style.exerciseListItem,
                {
                  backgroundColor: colorScheme
                    ? Colors[colorScheme].tabBackgroundColor
                    : Colors.light.tabBackgroundColor,
                },
              ]}
            >
              <TextInput
                style={[
                  style.exerciseListItemName,
                  {
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
                placeholder="Select Exercise"
                value={selectedExercise?.name}
                onPressIn={() => {
                  setShowExerciseSelectModal(true);
                  // Hide the keyboard
                  Keyboard.dismiss();
                }}
                readOnly
              />
              <TextInput
                style={[
                  style.exerciseListItemQuantity,
                  {
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
                placeholder="Quantity"
                value={selectedQuantity ? selectedQuantity.toString() : ""}
                onChangeText={(text) =>
                  setSelectedQuantity(
                    isNaN(parseInt(text, 10)) ? null : parseInt(text, 10),
                  )
                }
                inputMode="decimal"
              />
              <TextInput
                style={[
                  style.exerciseListItemQuantity,
                  {
                    color: colorScheme
                      ? Colors[colorScheme].text
                      : Colors.light.text,
                  },
                ]}
                placeholder="Unit"
                value={selectedUnit}
                onPressIn={() => {
                  setShowUnitSelectModal(true);
                  Keyboard.dismiss();
                }}
                readOnly
              />
              <TouchableOpacity
                onPress={() => {
                  if (!selectedExercise || !selectedQuantity) return;
                  const newExercise = {
                    id: idGen(),
                    exerciseId: selectedExercise.id,
                    name: selectedExercise.name,
                    quantity: selectedQuantity,
                    unit: selectedUnit,
                  } as ExerciseInRoutine;
                  setExercises([...exercises, newExercise]);
                  setSelectedExercise(null);
                  setSelectedQuantity(null);
                  setSelectedUnit(meassurementUnits[0]);
                }}
              >
                <Ionicons name="add" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardSpacer />

          <SaveButton />

          {/* Edit Exercise Modal */}
          <ExerciseInRoutineModal
            setExercise={setExerciseToEdit}
            exercise={exerciseToEdit}
            isOpen={showEditExerciseModal}
            closeModal={() => setShowEditExerciseModal(false)}
            showUnitSelectModal={() => setShowUnitSelectModal(true)}
            showExerciseSelectModal={() => setShowExerciseSelectModal(true)}
            onSave={saveEditedExercise}
          />

          {/* Exercise Select Modal */}
          <ExerciseSelectModal
            showModal={showExerciseSelectModal}
            closeModal={() => setShowExerciseSelectModal(false)}
            setSelectedExercise={
              showEditExerciseModal
                ? (exercise: Exercise) => {
                    setExerciseToEdit(
                      exerciseToEdit
                        ? {
                            ...exerciseToEdit,
                            exerciseId: exercise.id,
                            name: exercise.name,
                            description: exercise.description,
                          }
                        : null,
                    );
                  }
                : setSelectedExercise
            }
          />

          {/* Unit Select Modal */}
          <UnitSelectModal
            showModal={showUnitSelectModal}
            closeModal={() => setShowUnitSelectModal(false)}
            selectedUnit={selectedUnit}
            setSelectedUnit={
              showEditExerciseModal
                ? (unit: string) => {
                    setExerciseToEdit(
                      exerciseToEdit ? { ...exerciseToEdit, unit } : null,
                    );
                  }
                : setSelectedUnit
            }
          />
        </View>
      )}
    </View>
  );
}
