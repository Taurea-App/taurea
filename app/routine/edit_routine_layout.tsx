import { Ionicons } from "@expo/vector-icons";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Stack, useNavigation } from "expo-router";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
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
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { FlatList, RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EditExerciseModal from "./EditExerciseModal";
import EditSubroutineModal from "./EditSubroutineModal";
import { editRoutineLayoutStyle as style } from "./edit_routine_layout_style";

import ExerciseSelectModal from "@/components/ExerciseSelectmodal";
import UnitSelectModal from "@/components/UnitSelectModal";
import { EXERCISE_UNITS, NEW_SUBROUTINE_ID } from "@/constants";
import Colors from "@/constants/Colors";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import {
  Exercise,
  ExerciseInRoutine,
  FlatRoutineItem,
  RoutineItem,
  Subroutine,
} from "@/types";
import { idGen } from "@/utils/idGen";

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

  const [routineItems, setRoutineItems] = useState<FlatRoutineItem[]>([]);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isSubroutine, setIsSubroutine] = useState(false);

  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [showExerciseSelectModal, setShowExerciseSelectModal] = useState(false);
  const [showUnitSelectModal, setShowUnitSelectModal] = useState(false);
  const [showEditSubroutineModal, setShowEditSubroutineModal] = useState(false);

  const [loading, setLoading] = useState(!isNewRoutine);

  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<FlatRoutineItem | null>(
    null,
  );

  const [subroutineToEdit, setSubroutineToEdit] =
    useState<FlatRoutineItem | null>(null);

  const auth = FIREBASE_AUTH;

  const swipeableRefs = new Map();

  const flatListRef = useRef<FlatList<FlatRoutineItem> | null>(null);

  function isExercise(
    item: ExerciseInRoutine | Subroutine,
  ): item is ExerciseInRoutine {
    return (item as ExerciseInRoutine).exerciseId !== undefined;
  }

  useEffect(() => {
    setIsSubroutine(selectedExercise?.id === NEW_SUBROUTINE_ID);
    setSelectedUnit(null);
  }, [selectedExercise]);

  const manageSubitemsAssignment = (routineItems: FlatRoutineItem[]) => {
    const formattedItems = [];
    let inSubroutine = false;
    for (let i = 0; i < routineItems.length; i++) {
      const item = routineItems[i];
      if (item.exerciseId === "open-sub") {
        if (inSubroutine) {
          console.log("Error: nested subroutines not allowed");
          return;
        }
        inSubroutine = true;
        formattedItems.push(item);
        continue;
      }
      if (item.exerciseId === "close-sub") {
        if (!inSubroutine) {
          console.log("Error: close sub without open sub");
          return;
        }
        inSubroutine = false;
        formattedItems.push(item);
        continue;
      }
      formattedItems.push({ ...item, inSubroutine });
    }
    return formattedItems;
  };

  // Format the routine items to include the open and close subroutines
  const flatRoutine = (routineItems: RoutineItem[]) => {
    const formattedItems = [];
    for (let i = 0; i < routineItems.length; i++) {
      const item = routineItems[i];
      if (isExercise(item)) {
        formattedItems.push(item as FlatRoutineItem);
      } else {
        formattedItems.push({
          id: item.id + "-open",
          exerciseId: "open-sub",
          name: " ",
          quantity: item.quantity,
          unit: item.unit,
        } as FlatRoutineItem);

        for (let j = 0; j < item.exercises.length; j++) {
          const exercise = item.exercises[j];
          formattedItems.push({
            ...exercise,
            inSubroutine: true,
          } as FlatRoutineItem);
        }

        formattedItems.push({
          id: item.id + "-close",
          exerciseId: "close-sub",
          name: " ",
          quantity: 0,
          unit: "",
        } as FlatRoutineItem);
      }
    }
    return formattedItems;
  };

  // Format the routine items to include nested subroutines
  const nestedRoutine = (routineItems: FlatRoutineItem[]) => {
    const formattedItems = [];
    let currentSubroutine: Subroutine | null = null;
    for (let i = 0; i < routineItems.length; i++) {
      const item = routineItems[i];
      if (item.exerciseId !== "open-sub" && item.exerciseId !== "close-sub") {
        if (currentSubroutine) {
          currentSubroutine.exercises.push(item);
        } else {
          formattedItems.push(item);
        }
      } else if (item.exerciseId === "open-sub") {
        currentSubroutine = {
          // Remove "-open" from the id
          id: item.id.slice(0, -5),
          quantity: item.quantity,
          unit: item.unit,
          exercises: [],
        };
      } else if (item.exerciseId === "close-sub") {
        formattedItems.push(currentSubroutine);
        currentSubroutine = null;
      }
    }
    return formattedItems;
  };

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
      setRoutineItems(flatRoutine(routineSnap.data().routineItems));
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
      routineItems: nestedRoutine(routineItems),
      modifyDate: new Date(),
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

    setRoutineItems(
      routineItems.map((exercise) =>
        exercise.id === exerciseToEdit.id ? exerciseToEdit : exercise,
      ),
    );

    setShowEditExerciseModal(false);
  };

  const saveEditedSubroutine = () => {
    if (!subroutineToEdit) return;
    setRoutineItems(
      routineItems.map((item) =>
        item.id === subroutineToEdit.id ? subroutineToEdit : item,
      ),
    );

    setShowEditSubroutineModal(false);
  };

  const deleteExercise = (exerciseId: string) => {
    setRoutineItems(
      routineItems.filter((exercise) => exercise.id !== exerciseId),
    );
  };

  const deleteSubroutine = (subroutineId: string) => {
    setRoutineItems(
      routineItems.filter((exercise) => !exercise.id.includes(subroutineId)),
    );
  };

  const duplicateExercise = (exerciseUniqueId: string) => {
    const exercise = routineItems.find(
      (exercise) => exercise.id === exerciseUniqueId,
    );
    if (exercise) {
      const newExercise = {
        id: idGen(),
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        quantity: exercise.quantity,
        unit: exercise.unit,
      } as FlatRoutineItem;
      setRoutineItems([...routineItems, newExercise]);
    }
  };

  useEffect(() => {
    if (!isNewRoutine) {
      loadRoutine();
    }
  }, []);

  const renderDeleteSwipe = (
    _progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={style.deleteSwipe}>
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

  const renderDuplicateSwipe = (
    _progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [-1, 0, 0, 20],
    });
    return (
      <RectButton style={style.duplicateSwipe}>
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

  const createEmptySubroutine = (quantity: number, unit: string) => {
    const subroutineId = idGen();
    const openSubroutine = {
      id: subroutineId + "-open",
      exerciseId: "open-sub",
      name: " ",
      quantity,
      unit,
    } as FlatRoutineItem;
    const closeSubroutine = {
      id: subroutineId + "-close",
      exerciseId: "close-sub",
      name: " ",
      quantity: 0,
      unit: "",
    } as FlatRoutineItem;
    setRoutineItems([...routineItems, openSubroutine, closeSubroutine]);
  };

  const closeSwipeable = (exerciseId: string) => {
    const swipeable = swipeableRefs.get(exerciseId);
    if (swipeable) {
      swipeable.close();
    }
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: {
    item: FlatRoutineItem;
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
        renderLeftActions={renderDeleteSwipe}
        renderRightActions={renderDuplicateSwipe}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            if (item.exerciseId === "open-sub") {
              deleteSubroutine(item.id.slice(0, -5));
            } else if (item.exerciseId === "close-sub") {
              deleteSubroutine(item.id.slice(0, -6));
            } else {
              deleteExercise(item.id);
            }
          } else {
            duplicateExercise(item.id);
          }
          // Close the swipeable
          closeSwipeable(item.id);
        }}
      >
        {item.exerciseId === "open-sub" &&
          renderOpenSubroutine({ item, drag, isActive })}
        {item.exerciseId === "close-sub" &&
          renderCloseSubroutine({ item, drag, isActive })}
        {!item.exerciseId.includes("sub") &&
          renderExercise({ item, drag, isActive })}
      </Swipeable>
    );
  };

  const renderExercise = ({
    item,
    drag,
    isActive,
  }: {
    item: FlatRoutineItem;
    drag: any;
    isActive: boolean;
  }) => {
    return (
      <TouchableOpacity
        style={[
          style.exerciseListItem,
          {
            backgroundColor:
              item.exerciseId === "open-sub" || item.exerciseId === "close-sub"
                ? Colors[colorScheme ? colorScheme : "light"].primaryBackground
                : Colors[colorScheme ? colorScheme : "light"]
                    .tabBackgroundColor,

            paddingLeft: item.inSubroutine ? 40 : 10,
            borderRadius: item.inSubroutine ? 0 : 10,
          },
        ]}
        onLongPress={drag}
        disabled={isActive}
        onPress={() => {
          setShowEditExerciseModal(true);
          setIsSubroutine(false);
          setExerciseToEdit(item);
        }}
      >
        <Text
          style={[
            style.exerciseListItemName,
            {
              color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
            },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            style.exerciseListItemQuantity,
            {
              color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
            },
          ]}
        >
          {item.quantity} {item.unit}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOpenSubroutine = ({
    item,
    drag,
    isActive,
  }: {
    item: FlatRoutineItem;
    drag: any;
    isActive: boolean;
  }) => {
    return (
      <TouchableOpacity
        style={[
          style.openSubroutineElement,
          {
            backgroundColor:
              Colors[colorScheme ? colorScheme : "light"].primaryBackground,
            borderColor: Colors.gray,
          },
        ]}
        onLongPress={drag}
        disabled={isActive}
        onPress={() => {
          setShowEditSubroutineModal(true);
          setSubroutineToEdit(item);
        }}
      >
        <Text
          style={[
            style.exerciseListItemName,
            {
              color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
            },
          ]}
        >
          Subroutine
        </Text>
        <Text
          style={[
            style.exerciseListItemQuantity,
            {
              color: colorScheme ? Colors[colorScheme].text : Colors.light.text,
            },
          ]}
        >
          {item.quantity} {item.unit}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCloseSubroutine = ({
    item,
    drag,
    isActive,
  }: {
    item: RoutineItem;
    drag: any;
    isActive: boolean;
  }) => {
    return (
      <TouchableOpacity
        style={[
          style.closeSubroutineElement,
          {
            backgroundColor:
              Colors[colorScheme ? colorScheme : "light"].primaryBackground,
            borderColor: Colors.gray,
          },
        ]}
        onLongPress={drag}
        disabled={isActive}
      />
    );
  };

  const renderRoutineItem = ({
    item,
    drag,
    isActive,
  }: {
    item: FlatRoutineItem;
    drag: any;
    isActive: boolean;
  }) => {
    return (
      <ScaleDecorator>{renderItem({ item, drag, isActive })}</ScaleDecorator>
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
            data={routineItems}
            containerStyle={{ flex: 1 }}
            ref={flatListRef}
            onDragEnd={({ data }) => {
              const newRoutineItems = manageSubitemsAssignment(data);
              if (newRoutineItems) {
                setRoutineItems(newRoutineItems);
              }
            }}
            renderItem={({ item, drag, isActive }) =>
              renderRoutineItem({ item, drag, isActive })
            }
            keyExtractor={(item, index) => item.id}
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
                value={selectedUnit ?? ""}
                onPressIn={() => {
                  setShowUnitSelectModal(true);
                  Keyboard.dismiss();
                }}
                readOnly
              />

              <TouchableOpacity
                onPress={() => {
                  // If there's no exercise selected, do nothing
                  if (!selectedExercise || !selectedQuantity) return;

                  // If the selected exercise is a new subroutine, create a new subroutine
                  if (selectedExercise.id === NEW_SUBROUTINE_ID) {
                    if (!selectedQuantity || !selectedUnit) return;
                    createEmptySubroutine(selectedQuantity, selectedUnit);
                    setSelectedExercise(null);
                    setSelectedQuantity(null);
                    setSelectedUnit(EXERCISE_UNITS[0]);
                    return;
                  }
                  const newExercise = {
                    id: idGen(),
                    exerciseId: selectedExercise.id,
                    name: selectedExercise.name,
                    quantity: selectedQuantity,
                    unit: selectedUnit,
                  } as FlatRoutineItem;

                  setRoutineItems([...routineItems, newExercise]); // Add the new exercise to the routine

                  // Reset the form
                  setSelectedExercise(null);
                  setSelectedQuantity(null);
                  setSelectedUnit(EXERCISE_UNITS[0]);

                  // move the list to the bottom
                  if (flatListRef.current) {
                    flatListRef.current.scrollToEnd();
                  }
                }}
              >
                <Ionicons name="add" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardSpacer />

          <SaveButton />

          {/* Edit Exercise Modal */}
          <EditExerciseModal
            setExercise={setExerciseToEdit}
            exercise={exerciseToEdit}
            isOpen={showEditExerciseModal}
            closeModal={() => setShowEditExerciseModal(false)}
            showUnitSelectModal={() => setShowUnitSelectModal(true)}
            showExerciseSelectModal={() => setShowExerciseSelectModal(true)}
            onSave={saveEditedExercise}
            isSubroutine={isSubroutine}
          />

          {/* Edit Subroutine Modal  */}
          <EditSubroutineModal
            setSubroutine={setSubroutineToEdit}
            subroutine={subroutineToEdit}
            isOpen={showEditSubroutineModal}
            closeModal={() => setShowEditSubroutineModal(false)}
            showUnitSelectModal={() => setShowUnitSelectModal(true)}
            onSave={saveEditedSubroutine}
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
            selectedUnit={selectedUnit ?? ""}
            isSubroutine={isSubroutine}
            setSelectedUnit={
              showEditExerciseModal
                ? (unit: string) => {
                    setExerciseToEdit(
                      exerciseToEdit ? { ...exerciseToEdit, unit } : null,
                    );
                  }
                : showEditSubroutineModal
                  ? (unit: string) => {
                      setSubroutineToEdit(
                        subroutineToEdit ? { ...subroutineToEdit, unit } : null,
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
